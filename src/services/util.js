const writeFile = require('./write-file');

module.exports = function (opts) {
    const file = `
        let util = {

        };

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