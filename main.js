const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let logo = path.join(__dirname, 'assets/img/logo.png');
let win = null;

function createWindow () {
    win = new BrowserWindow({
        width: 360,
        // width: 1000,
        height: 572,
        title: 'iView',
        center: true,
        resizable: false,
        icon: logo,
        titleBarStyle: 'hidden'
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // 打开开发者工具。
    // win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('close', (e) => {
        if (win.isVisible()) {
            e.preventDefault();
            win.hide();
        }
    })
}

app.on('ready', () => {
    createWindow();
});
app.on('activate', () => {
    if (win == null) {
        createWindow();
    } else {
        win.show();
    }
});
app.on('quit', () => {
    app.quit();
});

// 检查更新
