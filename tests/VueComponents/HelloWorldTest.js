module.exports = class HelloWorldTest extends VueComponentTestCase
{
    /** @test */
    async it_is_able_to_change_the_component_text()
    {
        let component = this.render('<hello-world color="red"></hello-world>');
        this.assertEquals('<div class="red">Hello World</div>', await component.toHtml());

        component.vm.changeText('Hello JSUnit');
        this.assertEquals('<div class="red">Hello JSUnit</div>', await component.toHtml());
    }

    /** @test */
    async it_is_able_to_specify_a_text_color()
    {
        let component = this.render('<hello-world color="red"></hello-world>');
        this.assertEquals('<div class="red">Hello World</div>', await component.toHtml());
    }
}
