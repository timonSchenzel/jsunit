module.exports = class VueComponentTesterTest extends TestCase
{
    /** @test */
    async it_is_able_to_parse_raw_html_attribute_from_an_string()
    {
        let vueComponentTester = new VueComponentTester(this, `<hello-world foo="bar" bar="baz"></hello-world>`);
        this.assertEquals({
            foo: 'bar',
            bar: 'baz',
        }, vueComponentTester.props);
    }

    /** @test */
    async it_is_able_to_parse_raw_html_attribute_from_an_string_with_line_breaks()
    {
        let vueComponentTester = new VueComponentTester(
            this,
            `<hello-world
                foo="bar"
                bar="baz"
            ></hello-world>`);

        this.assertEquals({
            foo: 'bar',
            bar: 'baz',
        }, vueComponentTester.props);
    }
}
