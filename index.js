var babel = require('babel-core');

/*
    Return list of presets from a config

    @return {Array<Preset>}
*/
function getPresets() {
    var presets = this.config.get('pluginsConfig.es6tabs.presets');
    return presets.map(function(preset) {
        return require('babel-preset-' + preset);
    });
}

/*
    Return list of presets from a config

    @params {Block}
    @return {Block}
*/
function es6toEs5(block) {
    var result = babel.transform(block.body, {
        presets: getPresets.call(this)
    });

    return this.template.applyBlock('codetabs', {
        body: block.body,
        kwargs: {
            name: 'ES 6',
            type: 'js'
        },
        blocks: [
            {
                body: result.code,
                kwargs: {
                    name: 'ES 5',
                    type: 'js'
                }
            }
        ]
    });
}

module.exports = {
    blocks: {
        es6: {
            process: es6toEs5
        }
    }
};

