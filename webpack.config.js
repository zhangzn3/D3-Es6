/**
 * Created by Administrator on 2017/5/27.
 */
'use strict';
var path=require('path');
var webpack =require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports={
    context:path.join(__dirname,'./src'),
    entry:{
      "lib":['d3'],
      "home":'./pages/home/js/index.js'
    },
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'js/[name].bundle.js',
    },
    module:{
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
            { test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
              loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({ //全局化变量
            //当webpack碰到require的第三方库中出现全局的$、jQeury和window.jQuery时，就会使用node_module下jquery包export出来的东西
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "d3":"d3",

        }),
        new ExtractTextPlugin("css/style.css"),//单独使用link标签加载css并设置路径，相对于output配置中的publickPath
        new webpack.HotModuleReplacementPlugin(), //热加载
        new webpack.optimize.CommonsChunkPlugin({
            name: "lib",// 将公共模块提取，生成名为`common`的chunk
            chunks:["lib","home"],//提取哪些模块共有的部分，默认所有
            //filename: "js/common.js",
            //minChunks: 2 // 提取至少2个模块共有的部分
        }),
        //压缩代码 编译的速度会变慢,生产时用
/*        new uglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true //删除console
            }
        }),*/
        new HtmlWebpackPlugin({
            title:'page1',//用来生成页面的 title 元素
            template:"pages/home/home.html",//自定义的html页(默认支持ejs模板),如果不指定模板，会生成最基本的html结构
            filename:'home.html',//输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有子目录。
            hash:true,//生成hash,对于解除 cache 很有用
            inject:'body',//script资源插入模板的位置| 'head' | 'body' |
            chunks: ['lib','home']//需要引入的chunk，不配置就会引入所有页面的资源
        })
    ],
    devServer:{
        contentBase:path.join(__dirname,'./dist'),
        host: 'localhost',
        progress:true,//显示进度
        port: 3000, //默认8080
        inline: true,
        hot: true//热启动
    }
};

