const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const win = BrowserWindow.getAllWindows()[0];
const dialog = remote.dialog;
const shell = electron.shell;

const fs = require('fs');
const path = require('path');

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

let _path = path.join(__dirname, '../conf/lang.json');
let getLang = fs.readFileSync(_path);
let language = getLang? JSON.parse(getLang): { lang: 'zh', message: 'EN' };
Vue.config.lang = language.lang;
 
Object.keys(locales).forEach(function(lang){
    Vue.locale(lang, locales[lang])
})

const createPackage = require('../src/services/package');
const createBabel = require('../src/services/babel');
const { createWebpackBase, createWebpackDev, createWebpackProd } = require('../src/services/webpack');
const createVendors = require('../src/services/vendors');
const createRouter = require('../src/services/router');
const createI18n = require('../src/services/i18n');
const createApp = require('../src/services/app');
const createTemplate = require('../src/services/template');
const createIndexVue = require('../src/services/index-vue');
const createIndexHtml = require('../src/services/index-html');
const createMain = require('../src/services/main');
const createConfig = require('../src/services/config');
const createUtil = require('../src/services/util');
// const { createVuexStore, createVuexActions, createVuexMutations } = require('../src/services/vuex');
const createBus = require('../src/services/bus');
const { createESLintRc, createESLintIgnore } = require('../src/services/eslint');
const createGitignore = require('../src/services/gitignore');
const createEditorconfig = require('../src/services/editorconfig');

let saveDirectory = undefined;

Vue.component('log', {
    template: `
<li>
    <Icon size="14" type="load-c" class="ivu-load-loop" v-show="status === 1" color="#3399ff"></Icon>
    <Icon size="14" type="ios-checkmark-outline" v-show="status === 2" color="#00cc66"></Icon>
    <Icon size="14" type="ios-close-outline" v-show="status === 3" color="#ff5500"></Icon>
    <span> {{ content }}</span>
</li>
`,
    props: ['content', 'status']
});

const app = new Vue({
    el: '#app',
    data: {
        formValidate: {
            iviewVersion: '2.x',
            css: [],
            ajax: true,
            i18n: false,
            store: [],
            chart: [],
            eslint: true,
            funs: [],
            name: '',
            version: '1.0.0',
            desc: '',
            git: ''
        },
        ruleValidate: {

        },
        showMore: false,
        status: 'options',    // options,log,next
        log: {    // 1 is doing, 2 is done, 3 is error
            package: 1,
            babel: 1,
            webpackBase: 1,
            webpackDev: 1,
            webpackProd: 1,
            vendors: 1,
            router: 1,
            i18n: 1,
            app: 1,
            indexHtml: 1,
            indexVue: 1,
            template: 1,
            main: 1,
            config: 1,
            util: 1,
            // vuexStore: 1,
            // vuexActions: 1,
            // vuexMutations: 1,
            bus: 1,
            eslintRc: 1,
            eslintIgnore: 1,
            gitignore: 1,
            editorconfig: 1
        },
        language: language,
    },
    computed: {
        titleStatus () {
            let status = 2;
            for (let i in this.log) {
                let item = this.log[i];

                if (i === 'i18n' && !this.formValidate.i18n) continue;
                if (i === 'vuexStore' && this.formValidate.store.indexOf('vuex') < 0) continue;
                if (i === 'vuexActions' && this.formValidate.store.indexOf('vuex') < 0) continue;
                if (i === 'vuexMutations' && this.formValidate.store.indexOf('vuex') < 0) continue;
                if (i === 'bus' && this.formValidate.store.indexOf('bus') < 0) continue;
                if (i === 'eslintRc' && !this.formValidate.eslintRc) continue;
                if (i === 'eslintIgnore' && !this.formValidate.eslintRc) continue;

                if (item === 1) {
                    status = 1;
                    break;
                }
                if (item === 3) {
                    status = 3;
                    break;
                }
                status = 2;
            }

            return status;
        }
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    saveDirectory = dialog.showOpenDialog(win, {
                        title: app.$t('message.selectDir'),
                        properties: ['openDirectory', 'createDirectory']
                    });

                    if (saveDirectory) {
                        saveDirectory = saveDirectory[0];
                        this.status = 'log';

                        // package.json
                        createPackage({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.package = 2;
                            },
                            error: () => {
                                this.log.package = 3;
                            }
                        });

                        // .babelrc
                        createBabel({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.babel = 2;
                            },
                            error: () => {
                                this.log.babel = 3;
                            }
                        });

                        // webpack
                        createWebpackBase({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.webpackBase = 2;
                            },
                            error: () => {
                                this.log.webpackBase = 3;
                            }
                        });
                        createWebpackDev({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.webpackDev = 2;
                            },
                            error: () => {
                                this.log.webpackDev = 3;
                            }
                        });
                        createWebpackProd({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.webpackProd = 2;
                            },
                            error: () => {
                                this.log.webpackProd = 3;
                            }
                        });

                        // vendors
                        createVendors({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.vendors = 2;
                            },
                            error: () => {
                                this.log.vendors = 3;
                            }
                        });

                        // router
                        createRouter({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.router = 2;
                            },
                            error: () => {
                                this.log.router = 3;
                            }
                        });

                        // i18n
                        if (this.formValidate.i18n) {
                            createI18n({
                                data: this.formValidate,
                                directory: saveDirectory,
                                success: () => {
                                    this.log.i18n = 2;
                                },
                                error: () => {
                                    this.log.i18n = 3;
                                }
                            });
                        }

                        // app.vue
                        createApp({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.app = 2;
                            },
                            error: () => {
                                this.log.app = 3;
                            }
                        });

                        // index.ejs
                        createTemplate({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.template = 2;
                            },
                            error: () => {
                                this.log.template = 3;
                            }
                        });

                        // index.html
                        createIndexHtml({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.indexHtml = 2;
                            },
                            error: () => {
                                this.log.indexHtml = 3;
                            }
                        });

                        // index.vue
                        createIndexVue({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.indexVue = 2;
                            },
                            error: () => {
                                this.log.indexVue = 3;
                            }
                        });

                        // main
                        createMain({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.main = 2;
                            },
                            error: () => {
                                this.log.main = 3;
                            }
                        });

                        // config.js
                        createConfig({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.config = 2;
                            },
                            error: () => {
                                this.log.config = 3;
                            }
                        });

                        // util.js
                        createUtil({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.util = 2;
                            },
                            error: () => {
                                this.log.util = 3;
                            }
                        });

                        // vuex
                        // if (this.formValidate.store.indexOf('vuex') > -1) {
                        //     createVuexStore({
                        //         data: this.formValidate,
                        //         directory: saveDirectory,
                        //         success: () => {
                        //             this.log.vuexStore = 2;
                        //         },
                        //         error: () => {
                        //             this.log.vuexStore = 3;
                        //         }
                        //     });
                        //     createVuexActions({
                        //         data: this.formValidate,
                        //         directory: saveDirectory,
                        //         success: () => {
                        //             this.log.vuexActions = 2;
                        //         },
                        //         error: () => {
                        //             this.log.vuexActions = 3;
                        //         }
                        //     });
                        //     createVuexMutations({
                        //         data: this.formValidate,
                        //         directory: saveDirectory,
                        //         success: () => {
                        //             this.log.vuexMutations = 2;
                        //         },
                        //         error: () => {
                        //             this.log.vuexMutations = 3;
                        //         }
                        //     });
                        // }

                        // bus.js
                        if (this.formValidate.store.indexOf('bus.js') > -1) {
                            createBus({
                                data: this.formValidate,
                                directory: saveDirectory,
                                success: () => {
                                    this.log.bus = 2;
                                },
                                error: () => {
                                    this.log.bus = 3;
                                }
                            });
                        }

                        // ESLint
                        if (this.formValidate.eslint) {
                            createESLintRc({
                                data: this.formValidate,
                                directory: saveDirectory,
                                success: () => {
                                    this.log.eslintRc = 2;
                                },
                                error: () => {
                                    this.log.eslintRc = 3;
                                }
                            });
                            createESLintIgnore({
                                data: this.formValidate,
                                directory: saveDirectory,
                                success: () => {
                                    this.log.eslintIgnore = 2;
                                },
                                error: () => {
                                    this.log.eslintIgnore = 3;
                                }
                            });
                        }

                        // .gitignore
                        createGitignore({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.gitignore = 2;
                            },
                            error: () => {
                                this.log.gitignore = 3;
                            }
                        });

                        // .editorconfig
                        createEditorconfig({
                            data: this.formValidate,
                            directory: saveDirectory,
                            success: () => {
                                this.log.editorconfig = 2;
                            },
                            error: () => {
                                this.log.editorconfig = 3;
                            }
                        });
                    }
                }
            });
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        handleShowMore () {
            this.showMore = true;
        },
        handleNext () {
            this.status = 'next';
        },
        handleOpenDirectory () {
            shell.showItemInFolder(saveDirectory);
        },
        handleOpenFile (path) {
            shell.openItem(`${saveDirectory}/${path}`);
        },
        handleOpenLink (url) {
            shell.openExternal(url);
        },
        handleBackHome () {
            window.location.href = 'index.html';
        }
    }
});