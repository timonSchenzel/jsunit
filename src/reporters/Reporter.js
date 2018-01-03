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
        this.testsPassesCount = 0;
        this.testsFailuresCount = 0;
        this.assertionsCount = 0;
        this.passesAssertionsCount = 0;
        this.failuresAssertionsCount = 0;

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
        this.endTime = new this.reporterDate();
        this.executionTime = this.endTime - this.startTime;
        this.executionTimeFormatted = this.formatTime(this.executionTime);

        console.log('');
        console.log(`  ${this.errorContent} `);

        console.log('');
        console.log(`Time: ${this.executionTimeFormatted}`);
    }

    beforeEachTest(testName)
    {
        // console.log('before test');
    }

    afterEachTest(testName, results)
    {
        // console.log('after test');
    }

    beforeEachAssertion(assertion)
    {
        // console.log('before assertion');
    }

    afterEachAssertion(assertion)
    {
        // console.log('after assertion');

        if (! this.results[assertion.file]) {
            this.results[assertion.file] = {};
        }

        if (! this.results[assertion.file][assertion.function]) {
            this.results[assertion.file][assertion.function] = {};
        }

        let assertionsCount = Object.keys(this.results[assertion.file][assertion.function]).length;

        this.results[assertion.file][assertion.function][assertionsCount] = assertion;
    }

    afterEachFailedAssertion(assertion)
    {
        this.testsFailuresCount++;

        this.errorContent += `${this.testsFailuresCount}) ${assertion.test.file} -> ${assertion.test.function}`;
        this.errorContent += '\n';
        this.errorContent += `  ${assertion.error.fileName}`;
        this.errorContent += '\n';
        this.errorContent += `  ${this.visualError(assertion)}`;
    }

    afterEachPassedAssertion(assertion)
    {

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
      const colors = require('ava/lib/colors');
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

          const lineNumber = formatLineNumber(item.line, line) + ':';
          const coloredLineNumber = isErrorSource ? lineNumber : chalk.dim(lineNumber);
          const result = `   ${coloredLineNumber} ${item.value}`;

          return isErrorSource ? chalk.bgRed(result) : result;
        })
        .join('\n');

      errorContent = errorContent.substring(2);
      return errorContent;
    }
}
