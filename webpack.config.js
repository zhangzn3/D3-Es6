/**
 * Created by Administrator on 2017/5/27.
 */
var path = require('path'), webpack = require('webpack'), ExtractTextPlugin = require("extract-text-webpack-plugin");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin, HtmlWebpackPlugin = require('html-webpack-plugin'),CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.join(__dirname, './src'),
    entry: {
        "home": './pages/home/js/index.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: 'js/[name].bundle.js',
        publicPath:"/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            },
            {
                test: /\.(woff|woff2|svg|eot|ttf).*$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            }
        ]
    },
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./dll-manifest.json'),
            name: "dll"
        }),
        new webpack.ProvidePlugin({ //全局化变量
            //当webpack碰到require的第三方库中出现全局的$、jQeury和window.jQuery时，就会使用node_module下jquery包export出来的东西
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "d3": "d3",
            "_": "underscore",
            "dialog": "art-dialog",
            "svg2Png": "save-svg-as-png",
            "XLSX":"xlsx"
        }),
        new ExtractTextPlugin("css/style.css"),//单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        new webpack.HotModuleReplacementPlugin(), //热加载
        /* 
        new webpack.optimize.CommonsChunkPlugin({
                name: "common", // 将公共模块提取，生成名为`common`的chunk
                chunks: ["home"], //提取哪些模块共有的部分，默认所有
                filename: "js/common.js",
                minChunks: 2 // 提取至少2个模块共有的部分
            }),
            new uglifyJsPlugin({
                compress: {
                    warnings: false,
                    drop_console: true //删除console
                }
            }),
         */
        new CopyWebpackPlugin(
           [
            { from: 'components/thirdPart', to: '../dist/js/thirdPart' }
         ]
        ),
        new HtmlWebpackPlugin({
            title: 'page1',//用来生成页面的 title 元素
            template: "pages/home/index.html",//自定义的html页(默认支持ejs模板),如果不指定模板，会生成最基本的html结构
            filename: 'index.html',
            hash: true,
            inject: 'body',//script资源插入模板的位置| 'head' | 'body' |
            chunks: ['home']
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        host: 'localhost',
        progress: true,
        port: 3000,
        inline: true,
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:9999',
                secure: false,
                changeOrigin: true
            }
        }
    }
};

