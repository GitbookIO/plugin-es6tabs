var babel = require('babel-core');

function es6toEs5(block) {
    var result = babel.transform(block.body, {
        presets: [
            require('babel-preset-es2015'),
        ]
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

