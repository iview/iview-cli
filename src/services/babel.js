const writeFile = require('./write-file');

module.exports = function (opts) {
    const file = {
        "presets": [
            ["es2015", { "modules": false }]
        ]
    };
    writeFile({
        directory: opts.directory,
        fileName: '.babelrc',
        data: JSON.stringify(file),
        codeFormat: {
            indent_size: 2
        },
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};