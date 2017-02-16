const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const win = BrowserWindow.getAllWindows()[0];
const ipcMain = electron.ipcMain;

const axios = require('axios');
const shell = electron.shell;

const app = new Vue({
    el: '#app',
    data: {
        isHidden: false,
        version: 1,
        update: {},
        showUpdate: false
    },
    methods: {
        handleCreateApp () {
            window.location.href = 'create.html';
        },
        handleOpenDoc () {
            this.isHidden = true;
            setTimeout(() => {
                window.location.href = 'index_prod.html';
                win.setResizable(true);
                win.maximize();
            }, 100);
        },
        // 检查更新
        checkUpdate (constraint = false) {
            axios.get('https://raw.githubusercontent.com/iview/iview-cli/master/package.json')
                .then((response) => {
                    const data = response.data;
                    if (data.update.version > this.version) {
                        this.update = data.update;
                        this.showUpdate = true;
                    } else {
                        if (constraint) {
                            this.$Modal.info({
                                title: '检查更新',
                                content: '当前已是最新版本。'
                            })
                        }
                    }
                })
                .catch((error) => {

                });
        },
        handleOk () {
            if (process.platform == 'darwin') {
                shell.openExternal(this.update.mac);
            } else {
                shell.openExternal(this.update.windows);
            }
        },
        handleCancel () {

        }
    },
    ready () {
        this.checkUpdate();
    }
});