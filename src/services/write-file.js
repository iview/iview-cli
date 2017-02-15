const fs = require('fs');
const beauty = require('js-beautify').js_beautify;

module.exports = function (opts) {
    opts.codeFormat = opts.codeFormat || {};

    const data = beauty(opts.data, Object.assign({
        indent_size: 4
    }, opts.codeFormat));

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