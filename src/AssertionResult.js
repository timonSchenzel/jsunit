module.exports = class AssertionResult
{
	constructor(assertion, test, result = {})
	{
        this.assertion = assertion;
        this.test = test;
        this.pass = result['pass'];
		this.failed = ! result['pass'];
		delete result['pass'];
		this.result = result;

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
}
