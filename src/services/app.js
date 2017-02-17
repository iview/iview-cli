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
        ready () {

        },
        beforeDestroy () {

        },
        methods: {

        }
    };
</script>
    `;
    writeFile({
        directory: `${opts.directory}/src/components`,
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