const writeFile = require('./write-file');

module.exports = function (opts) {
    const file =
`root = true

charset = utf-8
indent_style = space
indent_size = 4
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true`;
    writeFile({
        directory: opts.directory,
        fileName: '.editorconfig',
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