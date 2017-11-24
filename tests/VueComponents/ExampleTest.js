module.exports = class HelloWorldTest extends VueComponentTestCase
{
    /** @test */
    it_is_able_render_the_example_component()
    {
        let component = this.render('<example>Test</example>');

        console.log(component.toHtml());
    }
}
