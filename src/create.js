const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const win = BrowserWindow.getAllWindows()[0];
const dialog = remote.dialog;

const fs = require('fs');
const createPackage = require('../src/services/package');
const { createWebpackBase, createWebpackDev, createWebpackProd } = require('../src/services/webpack');
const createRouter = require('../src/services/router');
const createI18n = require('../src/services/i18n');
const createApp = require('../src/services/app');
const createMain = require('../src/services/main');

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
            iviewVersion: '1.x',
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
        status: 'options',    // options,log
        log: {    // 1 is doing, 2 is done, 3 is error
            package: 1,
            webpackBase: 1,
            webpackDev: 1,
            webpackProd: 1,
            router: 1,
            i18n: 1,
            app: 1,
            main: 1
        }
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    saveDirectory = dialog.showOpenDialog(win, {
                        title: '选择工程保存目录',
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
                    }
                }
            });
        },
        handleReset (name) {
            this.$refs[name].resetFields();
        },
        handleShowMore () {
            this.showMore = true;
        }
    }
});