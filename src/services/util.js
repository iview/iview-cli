const writeFile = require('./write-file');

module.exports = function (opts) {
    let ajax = '';
    let ajaxSetting = '';
    if (opts.data.ajax) {
        ajax = `
            import axios from 'axios';
            import env from '../config/env';
        `;
        ajaxSetting = `
            const ajaxUrl = env === 'development' ?
            'http://127.0.0.1:8888' :
            env === 'production' ?
                'https://www.url.com' :
                'https://debug.url.com';
        
            util.ajax = axios.create({
                baseURL: ajaxUrl,
                timeout: 30000
            });`;
    }

    const file = `
        ${ajax}
        let util = {

        };
        util.title = function (title) {
            title = title ? title + ' - Home' : 'iView project';
            window.document.title = title;
        };
        ${ajaxSetting}

        export default util;
    `;
    writeFile({
        directory: `${opts.directory}/src/libs`,
        fileName: 'util.js',
        data: file,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};