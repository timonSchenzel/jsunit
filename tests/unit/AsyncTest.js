module.exports = class AsyncTest extends TestCase
{
    /** @test */
    async it_is_possible_to_run_async_code_inside_a_test()
    {
        await this.asyncTest(async (t) => {
            let value = await new Promise(function(resolve, reject) {
               setTimeout(() => resolve(true), 1000);
            });

            t.true(value);
        });

        this.assertTrue(true);
    }
}
