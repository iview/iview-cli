const writeFile = require('./write-file');

module.exports = function (opts) {
    let i18n = '';
    let i18nUse = '';
    let i18nAuto = '';
    if (opts.data.i18n) {
        i18n = `
            import VueI18n from 'vue-i18n';
            import Locales from './locale';
            import zhLocale from 'iview/src/locale/lang/zh-CN';
            import enLocale from 'iview/src/locale/lang/en-US';`;
        i18nUse = `Vue.use(VueI18n);`;
        i18nAuto = `
            // 自动设置语言
            const navLang = navigator.language;
            const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
            const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';
            
            Vue.config.lang = lang;
            
            // 多语言配置
            const locales = Locales;
            const mergeZH = Object.assign(zhLocale, locales['zh-CN']);
            const mergeEN = Object.assign(enLocale, locales['en-US']);
            Vue.locale('zh-CN', mergeZH);
            Vue.locale('en-US', mergeEN);`;
    }

    let vuex = '';
    let vuexUse = '';
    let store = '';
    let storeSet = '';

    if (opts.data.store.indexOf('vuex') > -1) {
        vuex = "import Vuex from 'vuex';";
        vuexUse = 'Vue.use(Vuex);';
        store = `
        const store = new Vuex.Store({
            state: {
                
            },
            getters: {
                
            },
            mutations: {
                
            },
            actions: {
                
            }
        });
        `;
        storeSet = 'store: store,';
    }

    const file = `
        import Vue from 'vue';
        import iView from 'iview';
        import VueRouter from 'vue-router';
        import Routers from './router';
        ${vuex}
        import Util from './libs/util';
        import App from './app.vue';
        import 'iview/dist/styles/iview.css';
        ${i18n}
        
        Vue.use(VueRouter);
        ${vuexUse}
        ${i18nUse}
        Vue.use(iView);
        ${i18nAuto}
        
        
        // 路由配置
        const RouterConfig = {
            mode: 'history',
            routes: Routers
        };
        const router = new VueRouter(RouterConfig);
        
        router.beforeEach((to, from, next) => {
            iView.LoadingBar.start();
            Util.title(to.meta.title);
            next();
        });
        
        router.afterEach(() => {
            iView.LoadingBar.finish();
            window.scrollTo(0, 0);
        });
        
        ${store}
        
        new Vue({
            el: '#app',
            router: router,${storeSet}
            render: h => h(App)
        });
    `;
    writeFile({
        directory: `${opts.directory}/src`,
        fileName: 'main.js',
        data: file,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};