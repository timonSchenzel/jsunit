module.exports = class Reporter
{
    constructor()
    {
        this.results = {};
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

    afterEachTest(results)
    {

    }

    beforeEachAssertion(assertionName)
    {

    }

    afterEachAssertion(results)
    {
        if (results._test.assertError) {
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
