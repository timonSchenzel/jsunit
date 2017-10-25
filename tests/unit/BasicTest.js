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
        this.assertEquals('bar', 'baz');
    }

    /** @test */
    it_is_able_to_assert_equals_with_arrays()
    {
        this.assertEquals([1, 2, 3], [3, 4, 5]);
    }
}
