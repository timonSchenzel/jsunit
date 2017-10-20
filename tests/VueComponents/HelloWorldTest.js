module.exports = class HelloWorldTest extends VueComponentTestCase
{
    /** @test */
    async it_is_able_to_change_the_component_text()
    {
        component.changeText('Hello JSUnit');

        this.assertEquals('<div class="red">Hello JSUnit</div>', await component.toHtml());
    }

    /** @test */
    async it_is_able_to_specify_a_text_color()
    {
        let component = this.render('<hello-world color="red"></hello-world>');

        this.assertEquals('<div class="red">Hello World</div>', await component.toHtml());
    }

    /** @test */
    async it_will_prevent_updating_its_text_to_some_bad_text()
    {
        let component = this.render('<hello-world></hello-world>');

        component.changeText('Bad text');
        this.assertEquals('<div>Hello World</div>', await component.toHtml());
    }
}
