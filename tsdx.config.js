/**********************************************************************
 *
 * @模块名称: tsdx.config
 *
 * @模块用途: tsdx.config
 *
 * @date: 2022/2/17 9:08
 *
 * @版权所有: pgli
 *
 **********************************************************************/
module.exports = {
    rollup: function (config, options) {
        config.output.sourcemap = false;
        return config
    }
}

