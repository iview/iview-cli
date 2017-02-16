const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const win = BrowserWindow.getAllWindows()[0];
const axios = require('axios');

const version = 1;

const app = new Vue({
    el: '#app',
    data: {
        isHidden: false
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
        checkUpdate() {
            axios.get('https://raw.githubusercontent.com/iview/iview-cli/master/package.json')
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    },
    ready () {
        this.checkUpdate();
    }
});