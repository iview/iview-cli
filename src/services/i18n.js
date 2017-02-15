const writeFile = require('./write-file');

module.exports = function (opts) {
    const file = `
        export default {
            'zh-CN': {
                
            },
            'en-US': {
                
            }
        };
    `;
    writeFile({
        directory: `${opts.directory}/src`,
        fileName: 'locale.js',
        data: file,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};