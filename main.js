const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let logo = path.join(__dirname, 'assets/img/WeFlow.png');
let win;

function createWindow () {
    win = new BrowserWindow({
        // width: 360,
        width: 1000,
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
    win.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })
}

app.on('ready', createWindow);

// 检查更新
