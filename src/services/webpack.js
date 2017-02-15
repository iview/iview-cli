const writeFile = require('./write-file');

module.exports = function (opts) {
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

    let webpackBase = `
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
        data: webpackBase,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};