const writeFile = require('./write-file');

exports.createWebpackBase = function (opts) {
    let vendors = '';
    if (opts.data.ajax) vendors += `, 'axios'`;
    if (opts.data.store.indexOf('vuex') > -1) vendors += `, 'vuex'`;
    if (opts.data.chart.indexOf('echarts') > -1) vendors += `, 'echarts'`;
    if (opts.data.funs.indexOf('cookies') > -1) vendors += `, 'js-cookie'`;
    if (opts.data.funs.indexOf('clipboard') > -1) vendors += `, 'clipboard'`;
    if (opts.data.funs.indexOf('html2canvas') > -1) vendors += `, 'html2canvas'`;
    if (opts.data.funs.indexOf('rasterizehtml') > -1) vendors += `, 'rasterizehtml'`;

    let css = '';
    if (opts.data.css.indexOf('less') > -1) css += `{ test: /\\.less/, loader: 'style!css!less?sourceMap'},`;
    if (opts.data.css.indexOf('sass') > -1) css += `{ test: /\\.scss$/, loader: 'style!css!sass?sourceMap'},`;

    let webpack = `
        const path = require('path');
        const webpack = require('webpack');
        
        module.exports = {
            // 入口
            entry: {
                main: './src/main',
                vendors: ['vue', 'vue-router'${vendors}]
            },
            // 输出
            output: {
                path: path.join(__dirname, './dist')
            },
            // 加载器
            module: {
                loaders: [
                    { test: /\\.vue$/, loader: 'vue' },
                    { test: /iview.src.*?js$/, loader: 'babel' },
                    { test: /\\.js$/, loader: 'babel', exclude: /node_modules/ },
                    { test: /\\.css$/, loader: 'style!css!autoprefixer'},
                    ${css}
                    { test: /\\.(gif|jpg|png|woff|svg|eot|ttf)\\??.*$/, loader: 'url-loader?limit=8192'},
                    { test: /\\.(html|tpl)$/, loader: 'html-loader' }
                ]
            },
            // 转es5
            babel: {
                presets: ['es2015'],
                plugins: ['transform-runtime']
            },
            resolve: {
                // require时省略的扩展名，如：require('module') 不需要module.js
                extensions: ['', '.js', '.vue'],
                // 别名，可以直接使用别名来代表设定的路径以及其他
                alias: {
                    filter: path.join(__dirname, './src/filters'),
                    components: path.join(__dirname, './src/components')
                }
            },
            plugins: [
        
            ]
        };
    `;
    writeFile({
        directory: opts.directory,
        fileName: 'webpack.base.config.js',
        data: webpack,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};

exports.createWebpackDev = function (opts) {
    let css = '';
    if (opts.data.css.indexOf('less') > -1) css += `
        ,less: ExtractTextPlugin.extract(
            'vue-style-loader',
            'css-loader!less-loader'
        )`;
    if (opts.data.css.indexOf('sass') > -1) css += `
        ,sass: ExtractTextPlugin.extract(
            'vue-style-loader',
            'css-loader!sass-loader'
        )`;

    let webpack = `
        const webpack = require('webpack');
        const config = require('./webpack.base.config.js');
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        const ExtractTextPlugin = require('extract-text-webpack-plugin');
        const fs = require('fs');
        
        config.devtool = '#source-map';                             // source-map
        config.output.publicPath = '/dist/';                        // 资源路径
        config.output.filename = '[name].js';                       // 入口js命名
        config.output.chunkFilename = '[name].chunk.js';            // 路由js命名
        
        config.vue = {
            loaders: {
                css: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader?sourceMap",
                    {
                        publicPath: "/dist/"
                    }
                )${css}
            }
        };
        
        config.plugins = (config.plugins || []).concat([
            new ExtractTextPlugin("[name].css",{ allChunks : true,resolve : ['modules'] }),             // 提取CSS
            new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),                           // 提取第三方库
            new HtmlWebpackPlugin({                                                                     // 构建html文件
                filename: '../index.html',
                template: './src/template/index.ejs',
                inject: false
            })
        ]);
        
        // 写入环境变量
        fs.open('./src/config/env.js', 'w', function (err, fd) {
            var buf = 'export default "development";';
            fs.write(fd,buf,0,buf.length,0,function(err,written,buffer){});
        });
        
        module.exports = config;
    `;
    writeFile({
        directory: opts.directory,
        fileName: 'webpack.dev.config.js',
        data: webpack,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};

exports.createWebpackProd = function (opts) {
    let css = '';
    if (opts.data.css.indexOf('less') > -1) css += `
        ,less: ExtractTextPlugin.extract(
            'vue-style-loader',
            'css-loader!less-loader'
        )`;
    if (opts.data.css.indexOf('sass') > -1) css += `
        ,sass: ExtractTextPlugin.extract(
            'vue-style-loader',
            'css-loader!sass-loader'
        )`;

    let webpack = `
        const webpack = require('webpack');
        const config = require('./webpack.base.config.js');
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        const ExtractTextPlugin = require('extract-text-webpack-plugin');
        const fs = require('fs');
        
        config.output.publicPath = path.join(__dirname, './dist/');  // 资源路径,根据需要可改为cdn地址
        config.output.filename = '[name].[hash].js';                 // 带hash值的入口js名称
        config.output.chunkFilename = '[name].[hash].chunk.js';      // 带hash值的路由js名称
        
        config.vue = {
            loaders: {
                css: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader",
                    {
                        publicPath: "../dist/"
                        // 特别提醒,如果这里的publicPath是以http://xxx.xxx这样以http://开头的,要写成
                        // publicPath: "http:\\\\xxx.xxx",否则会编译为"http:/xxx.xxx"
                    }
                )${css}
            }
        };
        
        config.plugins = (config.plugins || []).concat([
            // 提取带hash值的css名称
            new ExtractTextPlugin("[name].[hash].css",{ allChunks : true,resolve : ['modules'] }),
            // 提取带hash值的第三方库名称
            new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[hash].js'),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            }),
            // 压缩文件
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            // 构建html文件
            new HtmlWebpackPlugin({
                filename: '../index_prod.html',
                template: './src/template/index.ejs',
                inject: false
            })
        ]);
        
        // 写入环境变量
        fs.open('./src/config/env.js', 'w', function (err, fd) {
            var buf = 'export default "production";';
            fs.write(fd,buf,0,buf.length,0,function(err,written,buffer){});
        });
        
        module.exports = config;
    `;
    writeFile({
        directory: opts.directory,
        fileName: 'webpack.prod.config.js',
        data: webpack,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};