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

    afterTest(results)
    {

    }

    beforeEachTest(testName)
    {

    }

    afterEachTest(testName, results)
    {

    }

    beforeEachAssertion(assertion)
    {

    }

    afterEachAssertion(assertion)
    {
        if (assertion._test.assertError) {
            this.appendLog(chalk.red('x'));
        } else {
            this.appendLog(chalk.green('.'));
        }
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
