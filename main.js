const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let logo = path.join(__dirname, 'assets/img/logo.png');
let win = null;
let win_about = null;

let willClose = false;

function createWindow () {
    win = new BrowserWindow({
        width: 360,
        // width: 1000,
        height: 572,
        // height: 700,
        title: 'iView',
        // y:200,
        // x:20,
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
    win.on('close', (event) => {
        if (process.platform !== 'win32' && !willClose) {
            win.hide();
            event.preventDefault();
        }
    });
    win.on('closed', () => {
        win = null;
    });
}

function createMenu (language) {
    const template = [
        {
            label: app.getName(),
            submenu: [
                {
                    label: (language.lang==="zh"? "关于": "about")+' iView Cli',
                    click () {
                        if (win_about == null) {
                            win_about = new BrowserWindow({
                                width: 300,
                                height: 180,
                                title: (language.lang==="zh"? "关于": "about")+' iView',
                                center: true,
                                resizable: false,
                                icon: logo,
                                minimizable: false,
                                maximizable: false
                            });

                            win_about.loadURL(url.format({
                                pathname: path.join(__dirname, 'app/about.html'),
                                protocol: 'file:',
                                slashes: true
                            }));

                            win_about.on('closed', (e) => {
                                win_about = null;
                            });
                        }
                    }
                },
                {
                    role: 'quit',
                    label: (language.lang==="zh"? "退出": "Quit")
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
    let _path = path.join(__dirname, './conf/lang.json');
    let data = fs.readFileSync(_path);
    let language = data?JSON.parse(data):{ lang: 'zh', message: 'EN' };
    createWindow();
    createMenu(language);
});

app.on('activate', () => {
    if (win == null) {
        createWindow();
    } else {
        win.show();
    }
});
app.on('before-quit', function () {
    willClose = true;
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});