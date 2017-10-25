module.exports = class BasicTest extends TestCase
{
	/** @test */
	it_is_able_to_assert_true()
	{
		this.assertTrue(true);
	}

    /** @test */
    it_is_able_to_assert_equals_with_strings()
    {
        this.assertEquals('Hello jsUnit', 'Hello World');
    }

    /** @test */
    it_is_able_to_assert_equals_with_arrays()
    {
        this.assertEquals([1, 2, 3, 4], [3, 4, 5]);
    }

    /** @test */
    it_is_able_to_assert_equals_with_objects()
    {
        this.assertEquals({a: 1, b: 2, c: 3}, {a: 1, b: 3, d: 4});
    }
}
