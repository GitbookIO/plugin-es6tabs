var babel = require('babel-core');
var cheerio = require('cheerio');

/*
    Return list of presets from a config
*/
function getPresets() {
    var presets = this.config.get('pluginsConfig.es6tabs.presets');
    return presets.map(function(preset) {
        return require('babel-preset-' + preset);
    });
}


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

function replaceCodeBlocks(page) {
    var that = this;
    var $ = cheerio.load(page.content);

    $('code.lang-js').each(function() {
        var $this = $(this);
        var jsCode = $(this).text();
        var $pre = $this.parent('pre');

        try {
            var html = es6toEs5.call(that, {
                body: jsCode
            }).body;
            $pre.replaceWith(html);

            // Reapply highlight on all code blocks
            $pre.find('code').each(function() {
                $(this).html(
                    that.template.applyBlock('code', {
                        body: $(this).text(),
                        kwargs: {
                            language: 'javascript'
                        }
                    }).body
                );
            });
        } catch (e) {
            that.log.error.ln('Error with Javascript code block in "' + page.path + '":');
            that.log.error.ln(e.stack);
        }
    })


    page.content = $.html();
    return page;
}

module.exports = {
    blocks: {
        es6: {
            process: es6toEs5
        }
    },
    hooks: {
        page: replaceCodeBlocks
    }
};

