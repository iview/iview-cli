const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const win = BrowserWindow.getAllWindows()[0];
const dialog = remote.dialog;

const fs = require('fs');
const createPackage = require('../src/services/package');

let saveDirectory = undefined;

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
        status: 'options'    // options,log
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    saveDirectory = dialog.showOpenDialog(win, {
                        title: '选择工程保存目录',
                        properties: ['openDirectory', 'createDirectory']
                    });
                    createPackage({
                        data: this.formValidate,
                        directory: saveDirectory,
                        success: () => {
                            this.$Message.info('创建成功');
                        }
                    })
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