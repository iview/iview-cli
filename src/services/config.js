const writeFile = require('./write-file');

module.exports = function (opts) {
    const file = `
        import Env from './env';

        let config = {
            env: Env
        };
        export default config;
    `;
    writeFile({
        directory: `${opts.directory}/src/config`,
        fileName: 'config.js',
        data: file,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};