module.exports = class BasicTest extends TestCase
{
    test_without_annotation()
    {
        this.assertFalse(false);
    }

	/** @test */
	it_is_able_to_assert_true()
	{
		this.assertTrue(true);
	}

    /** @reporting-test */
    it_is_able_to_assert_equals_with_strings()
    {
        this.assertEquals('Hello jsUnit', 'Hello World');
    }

    /** @reporting-test */
    it_is_able_to_assert_equals_with_arrays()
    {
        this.assertEquals([1, 2, 3, 4], [3, 4, 5]);
    }

    /** @reporting-test */
    it_is_able_to_assert_equals_with_objects()
    {
        this.assertEquals({a: 1, b: 2, c: 3}, {a: 1, b: 3, d: 4});
    }

    /** @test */
    it_is_able_to_assert_the_count_from_an_array()
    {
        let array = [1, 2, 3];

        this.assertCount(3, array);
    }

    /** @test */
    it_is_able_to_assert_the_count_from_an_object()
    {
        let object = {a: 1, b: 2};

        this.assertCount(2, object);
    }

    /** @reporting-test */
    it_is_able_to_check_if_given_value_is_countable_when_assert_the_count()
    {
        let notCountable = null;

        this.assertCount(1, notCountable);
    }
}
