const writeFile = require('./write-file');

module.exports = function (opts) {
    const ajax = opts.data.ajax ? "import axios from 'axios';" : '';
    const vuex = opts.data.store.indexOf('vuex') > -1 ? "import Vuex from 'vuex';" : '';
    const echarts = opts.data.chart.indexOf('echarts') > -1 ? "import echarts from 'echarts';" : '';
    const cookies = opts.data.funs.indexOf('cookies') > -1 ? "import Cookies from 'js-cookie';" : '';
    const clipboard = opts.data.funs.indexOf('clipboard') > -1 ? "import clipboard from 'clipboard';" : '';
    const html2canvas = opts.data.funs.indexOf('html2canvas') > -1 ? "import html2canvas from 'html2canvas';" : '';
    const rasterizehtml = opts.data.funs.indexOf('rasterizehtml') > -1 ? "import rasterizehtml from 'rasterizehtml';" : '';

    const file = `
        import Vue from 'vue';
        import iView from 'iview';
        import VueRouter from 'vue-router';
        ${ajax}
        ${vuex}
        ${echarts}
        ${cookies}
        ${clipboard}
        ${html2canvas}
        ${rasterizehtml}
    `;
    writeFile({
        directory: `${opts.directory}/src`,
        fileName: 'vendors.js',
        data: file,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};