module.exports = class VueComponentTester
{
    constructor(testCaseInstance, template)
    {
        this.component = Vue.options.components['hello-world'];
        let component = this.component;

        this.vm = new Vue({
            template: component.sealedOptions.template,
            data() {
                return component.sealedOptions.data();
            },
            methods: component.sealedOptions.methods,
        });

        this.template = template;
        this.html = null;
        this.tester = testCaseInstance;
    }

    static test(testCaseInstance, template)
    {
        let tester = new this(testCaseInstance, template);
        return tester;
    }

    async toHtml()
    {
        let html = null;

        await VueRenderer.renderToString(
            this.vm,
            async (error, result) => {
                if (error) {
                    log.error(`Vue server renderer error:\n${error}`);
                }
                html = result;
            }
        );

        html = html.replace(' data-server-rendered="true"', '');

        if (html == this.template) {
            throw new Error(`Component [${this.template}] don't exists.`);
        }

        return html;
    }

    assertSee(expression)
    {
        let rawExpression = expression;

        if (typeof expression == 'string') {
            expression = new RegExp(expression, 'gim');
        }

        this.tester.assertRegExp(expression, this.html, `Assert that "${rawExpression}" should exists on the page, but it was not found.`);

        return this;
    }

    andSee(expression)
    {
        return this.assertSee(expression);
    }

    see(expression)
    {
        return this.assertSee(expression);
    }

    async assertNotSee(expression)
    {
        let rawExpression = expression;

        if (typeof expression == 'string') {
            expression = new RegExp(expression, 'gim');
        }

        this.tester.assertNotRegExp(expression, await this.toHtml(), `Assert that "${rawExpression}" should not exists on the page, but it was found.`);
    }

    andNotSee(expression)
    {
        return this.assertNotSee(expression);
    }

    notSee(expression)
    {
        return this.assertNotSee(expression);
    }

    async assertVisible(text)
    {
        let cheerio = require('cheerio');
        let html = await this.toHtml();
        let $ = cheerio.load(html);

        let isVisible = $('div').filter(function() {
            return $(this).text().trim() === text;
        }).attr('style') != 'display:none;';

        this.tester.assertTrue(isVisible);

        return this;
    }

    async assertNotVisible(text)
    {
        let cheerio = require('cheerio');
        let html = await this.toHtml();
        let $ = cheerio.load(html);

        let isNotVisible = $('div').filter(function() {
            return $(this).text().trim() === text;
        }).attr('style') == 'display:none;';

        this.tester.assertTrue(isNotVisible);

        return this;
    }
}
