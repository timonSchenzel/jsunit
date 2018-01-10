module.exports = class Reporter
{
    constructor()
    {
        this.ansiStyles = require('ansi-styles');
        this.formatTime = require('pretty-ms');
        this.concordance = require('concordance');
        this.forceColor = new chalk.constructor({enabled: true});
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

        this.theme = {
            boolean: this.ansiStyles.yellow,
            circular: this.forceColor.grey('[Circular]'),
            date: {
                invalid: this.forceColor.red('invalid'),
                value: this.ansiStyles.blue
            },
            diffGutters: {
                actual: this.forceColor.red('-') + ' ',
                expected: this.forceColor.green('+') + ' ',
                padding: '  '
            },
            error: {
                ctor: {open: this.ansiStyles.grey.open + '(', close: ')' + this.ansiStyles.grey.close},
                name: this.ansiStyles.magenta
            },
            function: {
                name: this.ansiStyles.blue,
                stringTag: this.ansiStyles.magenta
            },
            global: this.ansiStyles.magenta,
            item: {after: this.forceColor.grey(',')},
            list: {openBracket: this.forceColor.grey('['), closeBracket: this.forceColor.grey(']')},
            mapEntry: {after: this.forceColor.grey(',')},
            maxDepth: this.forceColor.grey('…'),
            null: this.ansiStyles.yellow,
            number: this.ansiStyles.yellow,
            object: {
                openBracket: this.forceColor.grey('{'),
                closeBracket: this.forceColor.grey('}'),
                ctor: this.ansiStyles.magenta,
                stringTag: {open: this.ansiStyles.magenta.open + '@', close: this.ansiStyles.magenta.close},
                secondaryStringTag: {open: this.ansiStyles.grey.open + '@', close: this.ansiStyles.grey.close}
            },
            property: {
                after: this.forceColor.grey(','),
                keyBracket: {open: this.forceColor.grey('['), close: this.forceColor.grey(']')},
                valueFallback: this.forceColor.grey('…')
            },
            react: {
                functionType: this.forceColor.grey('\u235F'),
                openTag: {
                    start: this.forceColor.grey('<'),
                    end: this.forceColor.grey('>'),
                    selfClose: this.forceColor.grey('/'),
                    selfCloseVoid: ' ' + this.forceColor.grey('/')
                },
                closeTag: {
                    open: this.forceColor.grey('</'),
                    close: this.forceColor.grey('>')
                },
                tagName: this.ansiStyles.magenta,
                attribute: {
                    separator: '=',
                    value: {
                        openBracket: this.forceColor.grey('{'),
                        closeBracket: this.forceColor.grey('}'),
                        string: {
                            line: {open: this.forceColor.blue('"'), close: this.forceColor.blue('"'), escapeQuote: '"'}
                        }
                    }
                },
                child: {
                    openBracket: this.forceColor.grey('{'),
                    closeBracket: this.forceColor.grey('}')
                }
            },
            regexp: {
                source: {open: this.ansiStyles.blue.open + '/', close: '/' + this.ansiStyles.blue.close},
                flags: this.ansiStyles.yellow
            },
            stats: {separator: this.forceColor.grey('---')},
            string: {
                open: this.ansiStyles.blue.open,
                close: this.ansiStyles.blue.close,
                line: {open: this.forceColor.blue('\''), close: this.forceColor.blue('\'')},
                multiline: {start: this.forceColor.blue('`'), end: this.forceColor.blue('`')},
                controlPicture: this.ansiStyles.grey,
                diff: {
                    insert: {
                        open: this.ansiStyles.bgGreen.open + this.ansiStyles.black.open,
                        close: this.ansiStyles.black.close + this.ansiStyles.bgGreen.close
                    },
                    delete: {
                        open: this.ansiStyles.bgRed.open + this.ansiStyles.black.open,
                        close: this.ansiStyles.black.close + this.ansiStyles.bgRed.close
                    },
                    equal: this.ansiStyles.blue,
                    insertLine: {
                        open: this.ansiStyles.green.open,
                        close: this.ansiStyles.green.close
                    },
                    deleteLine: {
                        open: this.ansiStyles.red.open,
                        close: this.ansiStyles.red.close
                    }
                }
            },
            symbol: this.ansiStyles.yellow,
            typedArray: {
                bytes: this.ansiStyles.yellow
            },
            undefined: this.ansiStyles.yellow
        };
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

    visualDifference(actual, expected)
    {
        return this.concordance.diff(actual, expected, {plugins: [], theme: this.theme})
            .split('\n').join('\n  ');
    }

    beautify(value)
    {
        return this.concordance.format(value, {plugins: [], theme: this.theme})
            .split('\n').join('\n  ');
    }

    visualError(assertion)
    {
        if (! assertion.error.fileName) {
            return '';
        }

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
        const excerpt = codeExcerpt(contents, sourceInput.line, { around: 1 });

        if (!excerpt) {
            return null;
        }

        const file = sourceInput.file;
        const line = sourceInput.line;

        const lines = excerpt.map(item => ({
            line: item.line,
            value: item.value,
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
