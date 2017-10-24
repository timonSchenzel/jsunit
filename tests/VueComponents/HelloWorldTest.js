module.exports = class HelloWorldTest extends VueComponentTestCase
{
    /** @test */
    async it_is_able_to_change_the_component_text()
    {
        let component = this.render('<hello-world></hello-world>');

        component.changeText('Hello JSUnit');

        this.assertSee('Hello JSUnit', await component.toHtml());
    }

    /** @test */
    async it_is_able_to_specify_a_text_color()
    {
        let component = this.render('<hello-world color="red"></hello-world>');

        this.assertSee('<div class="red">', await component.toHtml());
    }

    /** @test */
    async it_will_prevent_updating_its_text_with_some_bad_text()
    {
        let component = this.render('<hello-world></hello-world>');

        this.assertSee('Hello World', await component.toHtml());

        component.changeText('Bad text');

        this.assertSee('Hello World', await component.toHtml());
    }

    /** @test */
    async it_is_able_to_change_the_compent_text_with_a_button()
    {
        let component = this.render('<hello-world></hello-world>');

        this.assertNotSee('From button', await component.toHtml());

        component.click('button');

        this.assertSee('From button', await component.toHtml());
    }
}
