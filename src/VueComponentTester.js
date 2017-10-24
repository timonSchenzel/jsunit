module.exports = class VueComponentTester
{
    constructor(testCaseInstance, template)
    {
        this.template = template;
        this.html = null;
        this.props = {};
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

        let testComponent = this.component.sealedOptions;

        // this.vm = new Vue(testComponent);
        this.wrapper = vueTestUtils.mount(testComponent);
        this.vm = this.wrapper.vm;

        for (var prop in this.props) {
            this.vm._props[prop] = this.props[prop];
        }
    }

    parseProps()
    {
        let props = {};

        this.rawProps = this.rawProps.replace(/\s/g, '');
        this.rawProps = this.rawProps.replace(/"/g, '" ');
        this.rawProps = this.rawProps.replace(/=" /g, '="');

        this.rawProps.split(' ').map(prop => {
            return prop.split('=');
        }).forEach(prop => {
            if (! prop[0]) {
                return;
            }

            props[prop[0]] = prop[1].replace(/"/g, '');
        });

        return props;
    }

    static test(testCaseInstance, template)
    {
        let tester = new this(testCaseInstance, template);
        return tester;
    }

    toHtml()
    {
        this.wrapper.update();
        return this.wrapper.html();
    }

    assertSee(expression)
    {
        let rawExpression = expression;

        if (typeof expression == 'string') {
            expression = new RegExp(expression, 'gim');
        }

        let html = this.toHtml();

        this.tester.assertRegExp(expression, html, `Assert that "${rawExpression}" should exists on the page, but it was not found.`);

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

    assertNotSee(expression)
    {
        let rawExpression = expression;

        if (typeof expression == 'string') {
            expression = new RegExp(expression, 'gim');
        }

        this.tester.assertNotRegExp(expression, this.toHtml(), `Assert that "${rawExpression}" should not exists on the page, but it was found.`);
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

    click(selector)
    {
        this.find(selector).trigger('click');
    }

    typeInto(selector, value)
    {
        let elementWrapper = this.find(selector);

        elementWrapper.element.value = value;
        elementWrapper.trigger('input');
    }

    find(selector)
    {
        return this.wrapper.find(selector);
    }
}
