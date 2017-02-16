const writeFile = require('./write-file');

exports.createVuexStore = function (opts) {
    let file = `
        import Vue from 'vue';
        import Vuex from 'vuex';
        import mutations from './mutations';
        
        Vue.use(Vuex);
        
        const state = {
        
        };
        
        const store = new Vuex.Store({
        
        });
        
        export default store;
    `;
    writeFile({
        directory: `${opts.directory}/store`,
        fileName: 'store.js',
        data: file,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};

exports.createVuexActions = function (opts) {
    let file = ``;
    writeFile({
        directory: `${opts.directory}/store`,
        fileName: 'actions.js',
        data: file,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};

exports.createVuexMutations = function (opts) {
    let file = `
        export default {
        
        };
    `;
    writeFile({
        directory: `${opts.directory}/store`,
        fileName: 'mutations.js',
        data: file,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};