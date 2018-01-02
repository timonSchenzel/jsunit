module.exports = class Assertions
{
	constructor(reporter)
	{
		this.reporter = reporter;

		this.assertions = {
			pass: (message) =>
			{
				return {
					pass: true,
					message,
				};
			},

			fail: (message) =>
			{
				return {
					pass: false,
					message,
				};
			},

			assertTrue: (actual, message) =>
			{
				return {
					pass: actual == true,
					message,
				};
			},

			assertFalse: (actual, message) =>
			{
				return {
					pass: actual == false,
					message,
				};
			},

			assertEquals: (expected, actual, message) =>
			{
				return {
					pass: concordance.compare(actual, expected).pass == true,
					message,
				};
			},

			assertNotEquals: (expected, actual, message) =>
			{
				return {
					pass: concordance.compare(actual, expected).pass == false,
					message,
				};
			},

			assertCount: (expected, countable, message) =>
			{
				try {
					return {
						pass: this.assertEquals(Object.keys(countable).length, expected),
						message,
					};
				} catch (error) {
					return this.fail(`[${countable}] is not countable.`);
				}
			},

			assertContains: (regex, contents, message) =>
			{
				if (typeof regex == 'string') {
				    regex = new RegExp(regex, 'gim');
				}

				return {
					pass: regex.test(contents) == true,
					message,
				};
			},

			assertNotContains: (regex, contents, message) =>
			{
				if (typeof regex == 'string') {
				    regex = new RegExp(regex, 'gim');
				}

				return {
					pass: regex.test(contents) == false,
					message,
				};
			}
		};
	}

	macro(name, assertion)
	{
		this.assertions[name] = assertion;
	}

	build()
	{
		for (var assertion in this.assertions) {
			this[assertion] = this.assertions[assertion];
		}
	}

	// pass(message)
	// {
	// 	return new AssertionResult({
	// 		pass: true,
	// 		message,
	// 	});
	// }

	// fail(message)
	// {
	// 	return new AssertionResult({
	// 		pass: false,
	// 		message,
	// 	});
	// }

	// assertTrue(actual, message)
	// {
	// 	return new AssertionResult({
	// 		pass: actual == true,
	// 		message,
	// 	});
	// }

	// assertFalse(actual, message)
	// {
	// 	return new AssertionResult({
	// 		pass: actual == false,
	// 		message,
	// 	});
	// }

	// assertEquals(expected, actual, message)
	// {
	// 	return new AssertionResult({
	// 		pass: concordance.compare(actual, expected).pass == true,
	// 		message,
	// 	});
	// }

	// assertNotEquals(expected, actual, message)
	// {
	// 	return new AssertionResult({
	// 		pass: concordance.compare(actual, expected).pass == false,
	// 		message,
	// 	});
	// }

	// assertCount(expected, countable, message)
	// {
	// 	try {
	// 		return new AssertionResult({
	// 			pass: this.assertEquals(Object.keys(countable).length, expected),
	// 			message,
	// 		});
	// 	} catch (error) {
	// 		return this.fail(`[${countable}] is not countable.`);
	// 	}
	// }

	// assertContains(regex, contents, message)
	// {
	// 	if (typeof regex == 'string') {
	// 	    regex = new RegExp(regex, 'gim');
	// 	}

	// 	return new AssertionResult({
	// 		pass: regex.test(contents) == true,
	// 		message,
	// 	});
	// }

	// assertNotContains(regex, contents, message)
	// {
	// 	if (typeof regex == 'string') {
	// 	    regex = new RegExp(regex, 'gim');
	// 	}

	// 	return new AssertionResult({
	// 		pass: regex.test(contents) == false,
	// 		message,
	// 	});
	// }
}
