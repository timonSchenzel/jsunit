module.exports = class VueComponentTestCase extends TestCase
{
    render(template)
    {
        return VueComponentTester.test(
            this,
            template
        );
    }
}
