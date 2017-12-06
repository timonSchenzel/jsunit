module.exports = class MenuTest extends VueComponentTestCase
{
    /** @test */
    it_is_able_render_the_items_in_the_menu_component()
    {
        let items = ['Foo', 'Bar', 'Baz'];

        let component = this.render('<menu :items="items"></menu>', {
            items
        });

        this.assertEquals('<ul><li>Foo</li><li>Bar</li><li>Baz</li></ul>', component.toHtml());

        component.setItems(['Foo', 'Bar']);

        this.assertEquals('<ul><li>Foo</li><li>Bar</li></ul>', component.toHtml());
    }
}
