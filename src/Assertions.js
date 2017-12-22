module.exports = class Assertions
{
	constructor()
	{
		this.macros = {};
	}

	macro(name, assertion)
	{
		this.macros[name] = assertion;
	}

	pass(message)
	{
		return new AssertionResult({
			pass: true,
			message,
		});
	}

	fail(message)
	{
		return new AssertionResult({
			pass: false,
			message,
		});
	}

	assertTrue(actual, message)
	{
		return new AssertionResult({
			pass: actual == true,
			message,
		});
	}

	assertFalse(actual, message)
	{
		return new AssertionResult({
			pass: actual == false,
			message,
		});
	}

	assertEquals(expected, actual, message)
	{
		return new AssertionResult({
			pass: concordance.compare(actual, expected).pass == true,
			message,
		});
	}

	assertNotEquals(expected, actual, message)
	{
		return new AssertionResult({
			pass: concordance.compare(actual, expected).pass == false,
		});
	}

	assertCount(expected, countable, message)
	{
		try {
			return new AssertionResult({
				pass: this.assertEquals(Object.keys(countable).length, expected),
				message,
			});
		} catch (error) {
			this.fail(`[${countable}] is not countable.`);
		}
	}

	assertContains(regex, contents, message)
	{
		if (typeof regex == 'string') {
		    regex = new RegExp(regex, 'gim');
		}

		return new AssertionResult({
			pass: regex.test(contents) == true,
			message,
		});
	}

	assertNotContains(regex, contents, message)
	{
		if (typeof regex == 'string') {
		    regex = new RegExp(regex, 'gim');
		}

		return new AssertionResult({
			pass: regex.test(contents) == false,
			message,
		});
	}
}
