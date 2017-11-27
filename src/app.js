const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const win = BrowserWindow.getAllWindows()[0];
const ipcMain = electron.ipcMain;

const axios = require('axios');
const shell = electron.shell;

const zhLang = require('../assets/lang/zh').zhLang;
const enLang = require('../assets/lang/en').enLang;
const i18n = require('vue-i18n');
let locales = {
    en: {
        message: enLang
    },
    zh: {
        message: zhLang
    }
}

const fs = require('fs');
const path = require('path');
let _path = path.join(__dirname, '../conf/lang.json');
let getLang = fs.readFileSync(_path);
let language = getLang?JSON.parse(getLang):{ lang: 'zh', message: 'EN' };
Vue.config.lang = language.lang;


Object.keys(locales).forEach(function(lang){
    Vue.locale(lang, locales[lang])
})

const app = new Vue({
    el: '#app',
    data: {
        isHidden: false,
        version: 4,
        update: {},
        showUpdate: false,
        language: language,
        iviewVersion: 0
    },
    methods: {
        handleCreateApp () {
            window.location.href = 'create.html';
        },
        handleOpenDoc () {
            this.isHidden = true;
            setTimeout(() => {
                window.location.href = 'doc.html';
                win.setResizable(true);
                win.maximize();
            }, 100);
        },
        // 检查更新
        checkUpdate (constraint = false) {
            let msg = null;
            if (constraint) {
                msg = this.$Message.loading( app.$t('message.checkingUpdates') + '...', 0);
            }
            axios.get('https://raw.githubusercontent.com/iview/iview-cli/master/package.json?' + Date.parse(new Date()))
                .then((response) => {
                    const data = response.data;
                    if (data.update.version > this.version) {
                        msg();
                        this.update = data.update;
                        this.showUpdate = true;
                    } else {
                        if (constraint) {
                            setTimeout(() => {
                                msg();
                                this.$Modal.info({
                                    title: app.$t('message.intro'),
                                    content: app.$t('message.isLatestVersion'),
                                    okText: app.$t('message.ok')
                                })
                            }, 2000);
                        }
                    }
                })
        },
        handleOk () {
            if (process.platform === 'darwin') {
                shell.openExternal(this.update.mac);
            } else {
                shell.openExternal(this.update.windows);
            }
        },
        handleCancel () {

        },
        changeLauage () {
            Vue.config.lang = this.language.lang === 'zh'? 'en': 'zh';
            this.language = this.language.lang === 'zh'? { lang: "en", message: "中文" }: { lang: "zh", message: "EN" };
            fs.writeFile(_path, JSON.stringify(app.language), function(err){})
        }
    },
    mounted () {
        axios.get('https://api.github.com/repos/iview/iview/releases/latest').then(res => {
            this.iviewVersion = res.data.tag_name.substr(1);
        })
        this.checkUpdate();
    }
});
