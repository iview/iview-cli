const writeFile = require('./write-file');

module.exports = function (opts) {
    const file = `
<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                
            };
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    };
</script>
    `;
    writeFile({
        directory: `${opts.directory}/src`,
        fileName: 'app.vue',
        data: file,
        codeType: 'html',
        success () {
            opts.success();
        },
        error () {
            opts.error();
        }
    });
};