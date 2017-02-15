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

    const file = `
        import Vue from 'vue';
        import VueRouter from 'vue-router';
        import App from 'components/app.vue';
        import Routers from './router';
        import iView from 'iview';
        import 'iview/dist/styles/iview.css';${i18n}
        
        Vue.use(VueRouter);
        Vue.use(iView);${i18nUse}
        
        // 开启debug模式
        Vue.config.debug = true;${i18nAuto}
        
        // 路由配置
        let router = new VueRouter({
            // 是否开启History模式的路由, 如果生产环境的服务端没有进行相关配置,请慎用
            history: false
        });
        
        router.map(Routers);
        
        router.beforeEach(() => {
            window.scrollTo(0, 0);
        });
        
        router.afterEach(() => {
        
        });
        
        router.redirect({
            '*': "/index"
        });
        router.start(App, '#app');
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