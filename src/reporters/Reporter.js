module.exports = class Reporter
{
    constructor()
    {
        this.formatTime = require('pretty-ms');
        this.reporterDate = Date;

        this.results = {};
        this.passesResults = {};
        this.failuresResults = {};

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
        console.log(`  ${this.executionTimeFormatted}`);
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
}
