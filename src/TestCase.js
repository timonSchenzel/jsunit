module.exports = class TestCase
{
	constructor()
	{
		this.vm = null;
		this.name = null;
		this.reporter = null;
		this.firstAssertionHit = true;

		this.cleanupAfterSingleTestMethod();
	}

	setUp()
	{

	}

	beforeEach()
	{

	}

	afterEach()
	{
		this.cleanupAfterSingleTestMethod();
	}

	tearDown()
	{

	}

	async asyncTest(callable)
	{
		await test(async t => {
			this.beforeAssertion(t);

			await callable(t);

			this.afterAssertion(t);
		});
	}

	pass(message)
	{
		// .pass([message])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.pass(message);

			this.afterAssertion(t);
		});
	}

	fail(message)
	{
		// .fail([message])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.fail(message);

			this.afterAssertion(t);
		});
	}

	assertTrue(value, message)
	{
		value = this.normalizeValue(value);

		// .truthy(value, [message])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.truthy(value, message);

			this.afterAssertion(t);
		});
	}

	assertFalse(value, message)
	{
		value = this.normalizeValue(value);

		// .falsy(value, [message])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.falsy(value, message);

			this.afterAssertion(t);
		});
	}

	assertDeepEqual(expected, value, message)
	{
		value = this.normalizeValue(value);

		// .deepEqual(value, expected, [message])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.deepEqual(value, expected, message);

			this.afterAssertion(t);
		});
	}

	assertNotDeepEqual(expected, value, message)
	{
		value = this.normalizeValue(value);

		// .notDeepEqual(value, expected, [message])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.notDeepEqual(value, expected, message);

			this.afterAssertion(t);
		});
	}

	assertEquals(expected, value, message)
	{
		this.assertDeepEqual(expected, value, message);
	}

	assertNotEquals(expected, value, message)
	{
		this.assertNotDeepEqual(expected, value, message);
	}

	assertCount(expected, countable)
	{
		try {
			this.assertEquals(Object.keys(countable).length, expected);
		} catch (error) {
			this.fail(`[${countable}] is not countable.`);
		}
	}

	expectException(exception, message = null)
	{
		this.expectedException = exception;
		this.expectedExceptionMessage = message;
	}

	expectThrows(func, error, message)
	{
		// .throws(function|promise, [error, [message]])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.throws(func, error, message);

			this.afterAssertion(t);
		});
	}

	notExpectException(exception)
	{
		this.notExpectedException = exception;
	}

	notExpectThrows(func, error, message)
	{
		// .notThrows(function|promise, [message])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.notThrows(func, error, message);

			this.afterAssertion(t);
		});
	}

	assertRegExp(regex, contents, message)
	{
		if (typeof regex == 'string') {
		    regex = new RegExp(regex, 'gim');
		}

		// .regex(contents, regex, [message])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.regex(contents, regex, message);

			this.afterAssertion(t);
		});
	}

	assertNotRegExp(regex, contents, message)
	{
		if (typeof regex == 'string') {
		    regex = new RegExp(regex, 'gim');
		}

		// .notRegex(contents, regex, [message])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.notRegex(contents, regex, message);

			this.afterAssertion(t);
		});
	}

	assertContains(regex, contents, message)
	{
		this.assertRegExp(regex, contents, message);
	}

	assertNotContains(regex, contents, message)
	{
		this.assertNotRegExp(regex, contents, message);
	}

	takeSnapshot(contents, message)
	{
		// .snapshot(contents, [message])
		test(this.visualError(), async t => {
			this.beforeAssertion(t);

			await t.snapshot(contents, message);

			this.afterAssertion(t);
		});
	}

	normalizeValue(value)
	{
		if (typeof value == 'object' && value.hasOwnProperty('raw')) {
			return value.raw;
		}

		return value;
	}

	visualError(stack = null, name = null)
	{
		const codeExcerpt = require('code-excerpt');
		const equalLength = require('equal-length');
		const truncate = require('cli-truncate');
		const colors = require('ava/lib/colors');
		const indentString = require('indent-string');
		const formatLineNumber = (lineNumber, maxLineNumber) =>
			' '.repeat(Math.max(0, String(maxLineNumber).length - String(lineNumber).length)) + lineNumber;

		const maxWidth = 80;

		let fileName = null;
		let lineNumber = null;

		if (name == null) {
			name = this.name;
		}

		if (stack == null) {
			stack = stackTrace.get();

			let error = stack.filter(stackItem => {
				return stackItem.getFunctionName() == name.split(' -> ')[1];
			}).map(stackItem => {
				return {
					typeName: stackItem.getTypeName(),
					functionName: stackItem.getFunctionName(),
					methodName: stackItem.getMethodName(),
					fileName: stackItem.getFileName(),
					lineNumber: stackItem.getLineNumber(),
					columnNumber: stackItem.getColumnNumber(),
					isNative: stackItem.isNative(),
				};
			});

			if (error && error[0]) {
				fileName = error[0].fileName;
				lineNumber = error[0].lineNumber;
			}
		}

		if (! fileName) {
			return name;
		}

		let rootFolder = process.mainModule.paths[0].split('node_modules')[0].slice(0, -1) + '/';
		let relativeFileName = fileName.replace(rootFolder, '');

		let sourceInput = {};
		sourceInput.file = fileName;
		sourceInput.line = lineNumber;
		sourceInput.isDependency = false;
		sourceInput.isWithinProject = true;

		let contents = fs.readFileSync(sourceInput.file, 'utf8');
		const excerpt = codeExcerpt(contents, sourceInput.line, {maxWidth: process.stdout.columns, around: 1});

		if (! excerpt) {
			return null;
		}

		const file = sourceInput.file;
		const line = sourceInput.line;

		const lines = excerpt.map(item => ({
			line: item.line,
			value: truncate(item.value, maxWidth - String(line).length - 5)
		}));

		const joinedLines = lines.map(line => line.value).join('\n');
		const extendedLines = equalLength(joinedLines).split('\n');

		let errorContent = lines
			.map((item, index) => ({
				line: item.line,
				value: extendedLines[index]
			}))
			.map(item => {
				const isErrorSource = item.line === line;

				const lineNumber = formatLineNumber(item.line, line) + ':';
				const coloredLineNumber = isErrorSource ? lineNumber : chalk.dim(lineNumber);
				const result = `   ${coloredLineNumber} ${item.value}`;

				return isErrorSource ? chalk.bgRed(result) : result;
			})
			.join('\n');

		return name + ' at ' + sourceInput.file + ':' + sourceInput.line;
	}

	beforeAssertion(test)
	{
		if (this.firstAssertionHit) {
			this.firstAssertionHit = false;
			let [className, testName] = this.name.split(' -> ');

			this.reporter.beforeEachTest(className);
		}

		this.reporter.beforeEachAssertion(test);
	}

	afterAssertion(test)
	{
		this.reporter.results[test._test.title] = test;
		let results = {};

		if (this.firstAssertionHit) {
			this.firstAssertionHit = false;
			let [className, testName] = this.name.split(' -> ');

			this.reporter.afterEachTest(className, results);
		}

		this.reporter.afterEachAssertion(test);

		this.reporter.assertionCount++;

		// if (this.reporter.assertionCount == 48) {
		// 	this.reporter.afterTest(this.reporter.results);
		// }
	}

	cleanupAfterSingleTestMethod()
	{
		this.expectedException = null;
		this.expectedExceptionMessage = null;
		this.notExpectedException = null;
	}
}
