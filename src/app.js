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
        version: 2,
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
            let msg = null;
            if (constraint) {
                msg = this.$Message.loading('正在检查更新...', 0);
            }
            axios.get('https://raw.githubusercontent.com/iview/iview-cli/master/package.json?' + Date.parse(new Date()))
                .then((response) => {
                    const data = response.data;
                    if (data.update.version > this.version) {
                        this.update = data.update;
                        this.showUpdate = true;
                    } else {
                        if (constraint) {
                            setTimeout(() => {
                                msg();
                                this.$Modal.info({
                                    title: '检查更新',
                                    content: '当前已是最新版本。'
                                })
                            }, 2000);
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