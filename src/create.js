const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const win = BrowserWindow.getAllWindows()[0];
const dialog = remote.dialog;

const fs = require('fs');
const createPackage = require('../src/services/package');
const { createWebpackBase, createWebpackDev, createWebpackProd } = require('../src/services/webpack');

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
        }
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    saveDirectory = dialog.showOpenDialog(win, {
                        title: '选择工程保存目录',
                        properties: ['openDirectory', 'createDirectory']
                    })[0];

                    if (saveDirectory) {
                        this.status = 'log';

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