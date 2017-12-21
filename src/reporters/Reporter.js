module.exports = class Reporter
{
    constructor()
    {
        this.results = {};
        this.assertionCount = 0;
    }

    beforeBoot()
    {

    }

    afterBoot()
    {

    }

    beforeTest()
    {

    }

    afterTest()
    {
        // console.log(this.results);
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
