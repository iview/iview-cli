const writeFile = require('./write-file');

module.exports = function (opts) {
    const title = opts.data.name || 'iView project';

    const file = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>iView project</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <link rel="stylesheet" href="/dist/main.css">
</head>
<body>
    <div id="app"></div>
    <script type="text/javascript" src="/dist/vendors.js"></script>
    <script type="text/javascript" src="/dist/main.js"></script>
</body>
</html>
    `;
    writeFile({
        directory: opts.directory,
        fileName: 'index.html',
        data: file,
        codeType: 'html',
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};