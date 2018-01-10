module.exports = class AssertionResult
{
	constructor(assertion, test, reporter, result = {})
	{
        this.assertion = assertion;
        this.test = test;
        this.reporter = reporter;
        this.pass = result['pass'];
        this.failed = ! result['pass'];
        this.actual = result['actual'];
        this.expected = result['expected'];
        this.message = result['message'];
        this.contents = result['contents'];
        this.regex = result['regex'];
		this.failureMessage = result['failureMessage'];

        delete result['pass'];
        delete result['actual'];
        delete result['expected'];
        delete result['message'];
        delete result['failureMessage'];
        delete result['contents'];
		delete result['regex'];

		this.result = result;
        this.error = null;

        let stack = stackTrace.get();

        if (this.failed) {
            let rawError = Error;

            this.error = stack.filter(stackItem => {
                return stackItem.getFunctionName() == this.test.function;
            }).map(stackItem => {
                return {
                    typeName: stackItem.getTypeName(),
                    functionName: stackItem.getFunctionName(),
                    fileName: stackItem.getFileName(),
                    lineNumber: stackItem.getLineNumber(),
                    columnNumber: stackItem.getColumnNumber(),
                    isNative: stackItem.isNative(),
                };
            })[0];

            if (! this.error) {
                this.error = {};
            }

            this.error.raw = rawError;
        }
	}

    passed()
    {
        return this.pass == true;
    }

    failed()
    {
        return this.failed == true;
    }

    getFailureMessage()
    {
        let message = '';

        if (this.message) {
            message = `  ${this.message}\n\n`;
        }

        message += `  ${this.describeFailure()}`;

        return message;
    }

    describeFailure()
    {
        return `${this.failureMessage}:\n\n  ${this.beautify(this.actual)}`;
    }

    visualDifference()
    {
        return this.reporter.visualDifference(this.actual, this.expected);
    }

    beautify(value)
    {
        return this.reporter.beautify(value);
    }
}
