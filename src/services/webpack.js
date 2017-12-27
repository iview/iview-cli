const writeFile = require('./write-file');

exports.createWebpackBase = function (opts) {
    let css = '';
    let vueCss = '';
    if (opts.data.css.indexOf('less') > -1) {
        css += `
        {
            test: /\\.less/,
            use: ExtractTextPlugin.extract({
                use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                fallback: 'style-loader'
            })
        },
        `;
        vueCss += `
            less: ExtractTextPlugin.extract({
                use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                fallback: 'vue-style-loader'
            }),
        `;
    }
    if (opts.data.css.indexOf('sass') > -1) {
        css += `
        {
            test: /\\.sass/,
            use: ExtractTextPlugin.extract({
                use: ['autoprefixer-loader', 'sass-loader'],
                fallback: 'style-loader'
            })
        },
        `;
        vueCss += `
            sass: ExtractTextPlugin.extract({
                use: ['css-loader?minimize', 'autoprefixer-loader', 'sass-loader'],
                fallback: 'vue-style-loader'
            }),
        `;
    }

    const webpack = `
        const path = require('path');
        const webpack = require('webpack');
        const ExtractTextPlugin = require('extract-text-webpack-plugin');
        
        module.exports = {
            entry: {
                main: './src/main',
                vendors: './src/vendors'
            },
            output: {
                path: path.join(__dirname, './dist')
            },
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        use: [
                            {
                                loader: 'vue-loader',
                                options: {
                                    loaders: {
                                        less: ExtractTextPlugin.extract({
                                            use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                                            fallback: 'vue-style-loader'
                                        }),
                                        css: ExtractTextPlugin.extract({
                                            use: ['css-loader', 'autoprefixer-loader', 'less-loader'],
                                            fallback: 'vue-style-loader'
                                        })
                                    }
                                }
                            },
                            {
                                loader: 'iview-loader',
                                options: {
                                    prefix: false
                                }
                            }
                        ]
                    },
                    {
                        test: /iview\\/.*?js$/,
                        loader: 'babel-loader'
                    },
                    {
                        test: /\\.js$/,
                        loader: 'babel-loader',
                        exclude: /node_modules/
                    },
                    {
                        test: /\\.css$/,
                        use: ExtractTextPlugin.extract({
                            use: ['css-loader?minimize', 'autoprefixer-loader'],
                            fallback: 'style-loader'
                        })
                    },
                    ${css}
                    {
                        test: /\\.(gif|jpg|png|woff|svg|eot|ttf)\\??.*$/,
                        loader: 'url-loader?limit=1024'
                    },
                    {
                        test: /\\.(html|tpl)$/,
                        loader: 'html-loader'
                    }
                ]
            },
            resolve: {
                extensions: ['.js', '.vue'],
                alias: {
                    'vue': 'vue/dist/vue.esm.js'
                }
            }
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
    const webpack = `
        const webpack = require('webpack');
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        const ExtractTextPlugin = require('extract-text-webpack-plugin');
        const merge = require('webpack-merge');
        const webpackBaseConfig = require('./webpack.base.config.js');
        const fs = require('fs');
        
        fs.open('./src/config/env.js', 'w', function (err, fd) {
            const buf = 'export default "development";';
            fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
        });
        
        module.exports = merge(webpackBaseConfig, {
            devtool: '#source-map',
            output: {
                publicPath: '/dist/',
                filename: '[name].js',
                chunkFilename: '[name].chunk.js'
            },
            plugins: [
                new ExtractTextPlugin({
                    filename: '[name].css',
                    allChunks: true
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendors',
                    filename: 'vendors.js'
                }),
                new HtmlWebpackPlugin({
                    filename: '../index.html',
                    template: './src/template/index.ejs',
                    inject: false
                })
            ]
        });
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
    const webpack = `
        const webpack = require('webpack');
        const HtmlWebpackPlugin = require('html-webpack-plugin');
        const ExtractTextPlugin = require('extract-text-webpack-plugin');
        const merge = require('webpack-merge');
        const webpackBaseConfig = require('./webpack.base.config.js');
        const fs = require('fs');
        
        fs.open('./src/config/env.js', 'w', function (err, fd) {
            const buf = 'export default "production";';
            fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer){});
        });
        
        module.exports = merge(webpackBaseConfig, {
            output: {
                publicPath: '/dist/',
                filename: '[name].[hash].js',
                chunkFilename: '[name].[hash].chunk.js'
            },
            plugins: [
                new ExtractTextPlugin({
                    filename: '[name].[hash].css',
                    allChunks: true
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendors',
                    filename: 'vendors.[hash].js'
                }),
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: '"production"'
                    }
                }),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }),
                new HtmlWebpackPlugin({
                    filename: '../index_prod.html',
                    template: './src/template/index.ejs',
                    inject: false
                })
            ]
        });
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