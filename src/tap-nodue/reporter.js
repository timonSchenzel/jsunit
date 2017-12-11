require('colors');
const fs = require('fs');
const PassThrough = require('readable-stream/passthrough');
const duplexer = require('duplexer3');
const hirestime = require('hirestime');
const Parser = require('tap-parser');
const ms = require('pretty-ms');
const chalk = require('chalk');
const util = require('util');
const jsdiff = require('diff');

const concordance = require('concordance');
const concordanceOptions = require('ava/lib/concordance-options').default;
const concordanceDiffOptions = require('ava/lib/concordance-options').diff;

const formatSerializedError = require('ava/lib/reporters/format-serialized-error');
const improperUsageMessages = require('ava/lib/reporters/improper-usage-messages');

let testsOverview = '';
let visualErrors = '';
let noTestsFound = false;
let startTime = new Date().getTime();
let log = '';

const reporter = () => {
  const onResults = (data) => {
    const time = timer()

    // process.stdout.clearLine();
    // process.stdout.cursorTo(0);

    if (noTestsFound == false) {
      log += "\n";
      log += '  ' + chalk.dim(`Time: ${ms(time)}\n`);
    }


   // log += '  ' + testsOverview;
   // log += "\n";
   log += visualErrors;

    result.count = data.count
    result.errors = data.failures

    if (noTestsFound) {
      output.write(log);
      return;
    }

    if (data.fail) {
     log += "\n";
     log += '  ' + chalk.green(data.pass + ' passed\n');
     log += '  ' + chalk.red(data.fail + ' failed\n');
    } else {
     log += '  ' + chalk.green(data.pass + ' passed\n');
    }

    let runAsReportingTest = false;

    if (process.env.npm_config_argv) {
      let cliArguments = JSON.parse(process.env.npm_config_argv);
      if (cliArguments.remain && cliArguments.remain[0]) {
        if (cliArguments.remain[0] == '@reporting-test') {
          runAsReportingTest = true;
        }
      }
    }

    if (! runAsReportingTest) {
      output.write(log);
    }

    if (runAsReportingTest) {
      if (
        (
          log.includes("\u001b[31m-\u001b[39m \u001b[94m\'\u001b[39m\u001b[34mHello \u001b[39m\u001b[41m\u001b[30mWorld\u001b[39m\u001b[49m\u001b[94m\'\u001b[39m\n\u001b[32m+\u001b[39m \u001b[94m\'\u001b[39m\u001b[34mHello \u001b[39m\u001b[42m\u001b[30mjsUnit\u001b[39m\u001b[49m\u001b[94m\'\u001b[39m") ||
          log.includes("\u001b[31m-\u001b[39m \u001b[34m\'\u001b[39m\u001b[34mHello \u001b[39m\u001b[41m\u001b[30mWorld\u001b[39m\u001b[49m\u001b[34m\'\u001b[39m\n\u001b[32m+\u001b[39m \u001b[34m\'\u001b[39m\u001b[34mHello \u001b[39m\u001b[42m\u001b[30mjsUnit\u001b[39m\u001b[49m\u001b[34m\'\u001b[39m")
        )
        &&
        log.includes("  \u001b[90m[\u001b[39m\n\u001b[32m+\u001b[39m   \u001b[33m1\u001b[39m\u001b[90m,\u001b[39m\n\u001b[32m+\u001b[39m   \u001b[33m2\u001b[39m\u001b[90m,\u001b[39m\n    \u001b[33m3\u001b[39m\u001b[90m,\u001b[39m\n    \u001b[33m4\u001b[39m\u001b[90m,\u001b[39m\n\u001b[31m-\u001b[39m   \u001b[33m5\u001b[39m\u001b[90m,\u001b[39m\n  \u001b[90m]\u001b[39m")
        &&
        log.includes("  \u001b[90m{\u001b[39m\n    a: \u001b[33m1\u001b[39m\u001b[90m,\u001b[39m\n\u001b[31m-\u001b[39m   b: \u001b[33m3\u001b[39m\u001b[90m,\u001b[39m\n\u001b[32m+\u001b[39m   b: \u001b[33m2\u001b[39m\u001b[90m,\u001b[39m\n\u001b[31m-\u001b[39m   d: \u001b[33m4\u001b[39m\u001b[90m,\u001b[39m\n\u001b[32m+\u001b[39m   c: \u001b[33m3\u001b[39m\u001b[90m,\u001b[39m\n  \u001b[90m}\u001b[39m")
        &&
        log.includes('[null] is not countable')
      ) {
        output.write('\n  Reporting ' + chalk.green('OK') + '\n');
      } else {
        output.write('\n  Reporting ' + chalk.red('ERROR') + '\n');
      }
    }
  }

  const input = new Parser(onResults)
  const output = new PassThrough()
  const result = duplexer(input, output)
  let counter = 0;

  input.on('assert', (assert) => {
    // console.log(assert);

    if (assert.name.includes('No tests found in')) {
      testsOverview += chalk['yellow']('No tests found.');
      noTestsFound = true;
      return;
    }

    if (assert.name.includes('Test results were not received from')) {
      testsOverview += chalk['yellow']('No tests executed.');
      noTestsFound = true;
      return;
    }

    if (assert.ok) {
      testsOverview += chalk['green']('.');
      return;
    }

    testsOverview += chalk['red']('x');

    counter++;

    let name = '';
    let file = '';
    let formattedDiff = '';

    [name, file] = assert.name.split(' at ');

    if (assert.diag && assert.diag.message && assert.diag.message.includes('--stack')) {
      [message, stack] = assert.diag.message.split(' --stack ');
      assert.diag.message = message;

      file = stack.split("\n").filter(line => {
        return line.includes(name.split(' -> ')[0]);
      })[0];

      let regExp = /\(([^)]+)\)/;
      let matches = regExp.exec(file);
      file = matches[1];
      let parts = file.split(':');
      parts.pop();
      file = parts.join(':');
    }

    if (file) {
      visualErrors += '\n';
      visualErrors += '  ' + chalk.red('x') + ' ' + counter + ') ' + chalk.white(name) + '\n';
      visualErrors += '  ' + chalk.dim(file);
      visualErrors += '\n';
      visualErrors += '  ' + visualError(file);
      if (assert.diag.message) {
        visualErrors += '\n  ' + assert.diag.message + '\n';
      }

      for (message in assert.diag.values) {
        visualErrors += '\n\n  ' + message + '\n';

        let diffValue = assert.diag.values[message];
        let parsedValue = null;

        if (assert.diag.values['Difference:']) {
          let raw = parseRawData(diffValue);

          const actualDescriptor = concordance.describe(raw.actual, concordanceOptions);
          const expectedDescriptor = concordance.describe(raw.expected, concordanceOptions);
          let diff = formatDescriptorDiff(actualDescriptor, expectedDescriptor);

          visualErrors += '\n' + diff.formatted + '\n';
        } else {
          try {
            parsedValue = eval(diffValue);
          } catch (error) {
            parsedValue = diffValue;
          }

          let values = formatWithLabel('', parsedValue);
          visualErrors += '\n  ' + values.formatted + '\n';
        }
      };

      visualErrors += '\n';
    }
  });

  const timer = hirestime() // todo: init when first test running

  return result
}

function parseRawData(data) {
  let actual;
  let expected;
  let actualRaw = '';
  let expectedRaw = '';

  data = data.trim();
  data.split('\n').forEach(line => {
    if (line.startsWith('-')) {
      actualRaw += line.replace('-', '').replace(/\'/g, '').trim();
    } else if (line.startsWith('+')) {
      expectedRaw += line.replace('+', '').replace(/\'/g, '').trim();
    } else {
      actualRaw += line.replace(/\'/g, '').trim();
      expectedRaw += line.replace(/\'/g, '').trim();
    }
  });

  try {
    actual = eval(`(${actualRaw})`);
    expected = eval(`(${expectedRaw})`);
  } catch(error) {
    actual = actualRaw;
    expected = expectedRaw;
  }

  return {
    actual,
    expected,
  }
}

function formatDescriptorDiff(actualDescriptor, expectedDescriptor, options) {
  options = Object.assign({}, options, concordanceDiffOptions);
  return {
    label: 'Difference:',
    formatted: concordance.diffDescriptors(actualDescriptor, expectedDescriptor, options)
  };
}

function formatDescriptorWithLabel(label, descriptor) {
  return {
    label,
    formatted: concordance.formatDescriptor(descriptor, concordanceOptions)
  };
}

function formatWithLabel(label, value) {
  return formatDescriptorWithLabel(label, concordance.describe(value, concordanceOptions));
}

function visualError(fileName)
{
  const codeExcerpt = require('code-excerpt');
  const equalLength = require('equal-length');
  const truncate = require('cli-truncate');
  const colors = require('ava/lib/colors');
  const indentString = require('indent-string');
  const formatLineNumber = (lineNumber, maxLineNumber) =>
    ' '.repeat(Math.max(0, String(maxLineNumber).length - String(lineNumber).length)) + lineNumber;

  const maxWidth = 80;

  let parts = fileName.split(':');
  let lineNumber = parseInt(parts.pop());

  fileName = parts.join(':');

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

function visualDiff(test)
{
  let status = '';

  if (test.avaAssertionError) {
    const result = formatSerializedError(test);
    if (result.printMessage) {
      status += '\n' + indentString(test.message, 2) + '\n';
    }

    if (result.formatted) {
      status += '\n' + indentString(result.formatted, 2) + '\n';
    }

    const message = improperUsageMessages.forError(test);
    if (message) {
      status += '\n' + indentString(message, 2) + '\n';
    }
  } else if (test.message) {
    status += '\n' + indentString(test.message, 2) + '\n';
  }

  return status;
}

module.exports = reporter
