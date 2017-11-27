const writeFile = require('./write-file');

module.exports = function (opts) {
    const file = `
        import Vue from 'vue';
        export default new Vue({
            data () {
                return {
                    
                };
            },
            computed: {
        
            },
            methods: {
                
            }
        });
    `;
    writeFile({
        directory: `${opts.directory}/src`,
        fileName: 'bus.js',
        data: file,
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};