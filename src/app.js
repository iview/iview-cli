const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const win = BrowserWindow.getAllWindows()[0];

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
        }
    }
});