module.exports = class CoreAssertionsTest extends TestCase
{
    /** @test */
    async it_is_able_to_assert_true()
    {
        // let value = await this.getTrueFromAsync();
        this.assertTrue(true);

        // this.assertEquals([1, 2, 3], [1, 3, 2]);
    }

    async getTrueFromAsync()
    {
        return true;
    }

    /** @test */
    it_is_able_to_assert_false()
    {
        this.assertFalse(false);
    }

    /** @test */
    it_is_able_to_assert_equals_with_strings()
    {
        this.assertEquals('Hello jsUnit', 'Hello jsUnit');
    }

    /** @test */
    it_is_able_to_assert_equals_with_arrays()
    {
        this.assertEquals([1, 2, 3], [1, 2, 3]);
    }

    /** @test */
    it_is_able_to_assert_equals_with_objects()
    {
        this.assertEquals({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 3});
    }

    /** @test */
    it_is_able_to_assert_not_equals_with_strings()
    {
        this.assertNotEquals('Hello jsUnit', 'Hello World');
    }

    /** @test */
    it_is_able_to_assert_not_equals_with_arrays()
    {
        this.assertNotEquals([1, 2, 3], [1, 2, 99]);
    }

    /** @test */
    it_is_able_to_assert_not_equals_with_objects()
    {
        this.assertNotEquals({a: 1, b: 2, c: 3}, {a: 1, b: 2, c: 99});
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

    /** @test */
    it_is_able_assert_that_a_string_not_contains_some_string()
    {
        this.assertNotContains('foo', 'bar');
    }
}
