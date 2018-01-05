module.exports = class Reporter
{
    constructor()
    {
        this.formatTime = require('pretty-ms');
        this.reporterDate = Date;

        this.results = {};
        this.passesResults = {};
        this.failuresResults = {};
        this.errorContent = '';

        this.testsCount = 0;
        this.testFailures = {};
        this.testsPassesCount = 0;
        this.testsFailuresCount = 0;

        this.assertionsCount = 0;
        this.assertionsPassesCount = 0;
        this.assertionsFailuresCount = 0;

        this.startTime = null;
        this.endTime = null;
        this.executionTime = null;
        this.executionTimeFormatted = null;
    }

    beforeBoot()
    {

    }

    afterBoot()
    {
        // Assertions.macro('assertNull', (actual, message) => {
        //     return new Assertion({
        //         pass: actual == null,
        //         message,
        //     });
        // });
    }

    beforeTest()
    {
        this.startTime = new this.reporterDate();
    }

    afterTest()
    {
        if (this.assertionsCount == 0) {
            this.log(chalk.yellow(`  No tests executed.`));
            return;
        }

        this.endTime = new this.reporterDate();
        this.executionTime = this.endTime - this.startTime;
        this.executionTimeFormatted = this.formatTime(this.executionTime);

        this.log('');

        if (this.assertionsFailuresCount > 0) {
            this.log(`  ${this.errorContent} `);
        }

        this.log(chalk.dim(`  Time: ${this.executionTimeFormatted}`));
        if (this.assertionsPassesCount > 0) {
            this.log(chalk.green(`  ${this.assertionsPassesCount} passed, ${this.testsPassesCount} tests`));
        }

        if (this.assertionsFailuresCount > 0) {
            this.log(chalk.red(`  ${this.assertionsFailuresCount} failed, ${this.testsFailuresCount} tests`));
        }
    }

    beforeEachTest(testName)
    {

    }

    afterEachTest(testName, results, failuresCount)
    {
        this.testsCount++;
    }

    afterEachFailedTest(testName, results, failuresCount)
    {
        this.testsFailuresCount++;
    }

    afterEachPassedTest(testName, results)
    {
        this.testsPassesCount++;
    }

    beforeEachAssertion(assertion)
    {

    }

    afterEachAssertion(assertion)
    {
        this.assertionsCount++;

        if (! this.testFailures[assertion.test.file]) {
            this.testFailures[assertion.test.file] = 0;
        }

        if (! this.results[assertion.test.file]) {
            this.results[assertion.test.file] = {};
        }

        if (! this.results[assertion.test.file][assertion.test.function]) {
            this.results[assertion.test.file][assertion.test.function] = {};
        }

        let assertionsCount = Object.keys(this.results[assertion.test.file][assertion.test.function]).length;

        this.results[assertion.test.file][assertion.test.function][assertionsCount] = assertion;
    }

    afterEachFailedAssertion(assertion)
    {
        this.testFailures[assertion.test.file]++;
        this.assertionsFailuresCount++;

        this.errorContent += '\n';
        this.errorContent += '  ' + chalk.red('x') + chalk.white(` ${this.assertionsFailuresCount}) ${assertion.test.file} -> ${assertion.test.function}`);
        this.errorContent += '\n';
        this.errorContent += chalk.dim(`  ${assertion.error.fileName}:${assertion.error.lineNumber}`);
        this.errorContent += '\n';
        this.errorContent += '\n';
        this.errorContent += `  ${this.visualError(assertion)}`;
        this.errorContent += '\n\n';
        this.errorContent += `${assertion.getFailureMessage()}`;
        this.errorContent += '\n';
    }

    afterEachPassedAssertion(assertion)
    {
      this.assertionsPassesCount++;
    }

    log(message)
    {
        console.log(message);
    }

    appendLog(message)
    {
        process.stdout.write(message);
    }

    visualError(assertion)
    {
        const codeExcerpt = require('code-excerpt');
        const equalLength = require('equal-length');
        const truncate = require('cli-truncate');
        const indentString = require('indent-string');
        const formatLineNumber = (lineNumber, maxLineNumber) =>
        ' '.repeat(Math.max(0, String(maxLineNumber).length - String(lineNumber).length)) + lineNumber;

        const maxWidth = 80;

        let fileName = assertion.error.fileName;
        let lineNumber = assertion.error.lineNumber;

        let sourceInput = {};
        sourceInput.file = fileName;
        sourceInput.line = lineNumber;
        sourceInput.isDependency = false;
        sourceInput.isWithinProject = true;

        let contents = fs.readFileSync(sourceInput.file, 'utf8');
        const excerpt = codeExcerpt(contents, sourceInput.line, {maxWidth: process.stdout.columns, around: 1});

        if (!excerpt) {
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

                const lineNumber = formatLineNumber(item.line, line) + '|';
                const coloredLineNumber = isErrorSource ? lineNumber : chalk.dim(lineNumber);
                const result = `   ${coloredLineNumber} ${item.value}`;

                return isErrorSource ? chalk.bgRed(result) : result;
            })
            .join('\n');

        errorContent = errorContent.substring(2);
        return errorContent;
    }
}
