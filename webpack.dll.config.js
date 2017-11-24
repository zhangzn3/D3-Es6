/**
 * Created by Administrator on 2017/7/3.
 */
var path = require('path'),webpack = require('webpack');
module.exports = {
    entry: {
        dll: ['babel-polyfill','d3','save-svg-as-png',"xlsx"]
    },
    output: {
        path:path.join(__dirname,'./dist/js'),
        // output.library 将会定义为 window.${output.library}
        filename: '[name].bundle.js',
        library: '[name]'
    },
    plugins: [
/*        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),*/
        new webpack.DllPlugin({
            //path 定义 manifest文件生成的位置 [name]的部分由entry的名字替换
            path: path.join(__dirname, '[name]-manifest.json'),
            //name dll bundle输出到那个全局变量上和 output.library 一样即可
            name: '[name]'
        })
    ]
};