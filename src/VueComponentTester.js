module.exports = class VueComponentTester
{
    constructor(testCaseInstance, template)
    {
        this.template = template;
        this.html = null;
        this.props = null;
        this.tester = testCaseInstance;
        this.tagName = template.match(/<([^\s>]+)(\s|>)+/)[1];
        this.rawProps = template.match(/\s([^\>]+)(|>)+/);

        if (this.rawProps && this.rawProps[1]) {
            this.rawProps = this.rawProps[1];
            this.props = this.parseProps();
        } else {
            this.rawProps = null;
        }

        this.component = Vue.options.components[this.tagName];

        if (! this.component) {
            throw new Error(`Component [${this.tagName}] don't exists.`);
        }

        // console.log(this.component.sealedOptions);
        let testComponent = this.component.sealedOptions;
        // testComponent.template = this.template;

        // console.log(testComponent);
        // let templateParts = testComponent.template.split('>');
        // templateParts[0] = `${templateParts[0]} ${this.props}`;
        // testComponent.template = templateParts.join('>');

        this.vm = new Vue(testComponent);

        // this.vm._props.color = 'red';
    }

    parseProps()
    {
        let props = {};

        this.rawProps.split(' ').map(prop => {
            return prop.split('=');
        }).forEach(prop => {
            props[prop[0]] = prop[1].replace(/"/g, '');
        });

        return props;
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
            throw new Error(`Component [${this.tagName}] don't exists.`);
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
