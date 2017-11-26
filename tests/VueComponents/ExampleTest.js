module.exports = class HelloWorldTest extends VueComponentTestCase
{
    /** @test */
    it_is_able_render_the_example_component()
    {
        let component = this.render('<example><div>Test</div></example>');

        this.assertEquals('<div><div>Test</div></div>', component.toHtml());
    }
}
