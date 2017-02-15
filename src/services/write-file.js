const fs = require('fs');
const beauty = require('js-beautify').js_beautify;
const beautyHtml = require('js-beautify').html;
const beautyCss = require('js-beautify').css;

module.exports = function (opts) {
    opts.codeFormat = opts.codeFormat || {};
    opts.codeType = opts.codeType || 'js';

    let data = '';
    if (opts.codeType === 'html') {
        data = beautyHtml(opts.data, Object.assign({

        }, opts.codeFormat));
    } else if (opts.codeType === 'js') {
        data = beauty(opts.data, Object.assign({
            indent_size: 4
        }, opts.codeFormat));
    } else if (opts.codeType === 'css') {
        data = beautyCss(opts.data, Object.assign({
            indent_size: 4
        }, opts.codeFormat));
    } else if (opts.codeType === 'none') {
        data = opts.data;
    }

    if (!fs.existsSync(opts.directory)) {
        fs.mkdirSync(opts.directory);
    }

    fs.writeFile(`${opts.directory}/${opts.fileName}`, data, (err) => {
        if (err) {
            if (opts.error) opts.error(err);
            return false;
        }
        if (opts.success) opts.success();
    });
};