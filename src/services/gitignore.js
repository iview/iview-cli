const writeFile = require('./write-file');

module.exports = function (opts) {
    const file =
`.idea
.idea/
.DS_Store
node_modules/
.project
dist
dist/*
src/config/*.tmp
src/config/env.js
npm-debug.log`;
    writeFile({
        directory: opts.directory,
        fileName: '.gitignore',
        data: file,
        codeType: 'none',
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};