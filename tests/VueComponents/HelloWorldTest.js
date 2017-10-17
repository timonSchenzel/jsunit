module.exports = class HelloWorldTest extends VueComponentTestCase
{
    /** @test */
    async it_is_able_to_render_the_component()
    {
        let component = this.render('<hello-world></hello-world>');
        this.assertEquals('<div>Hello World</div>', await component.toHtml());

        console.log(component.vm.$children[0].$data);
        console.log(await component.toHtml());

        component.vm.$children[0].changeText('Hello JSUnit');

        console.log(component.vm.$children[0].$data);
        console.log(await component.toHtml());

        // component.vm.changeText('Hello JSUnit');
        this.assertEquals('<div>Hello JSUnit</div>', await component.toHtml());
    }
}
