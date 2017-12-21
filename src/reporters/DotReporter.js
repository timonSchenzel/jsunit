module.exports = class DotReporter extends Reporter
{
    afterEachFailedAssertion(assertion)
    {
        super.afterEachFailedAssertion(assertion);

        this.appendLog(chalk.red('x'));
    }

    afterEachPassedAssertion(assertion)
    {
        super.afterEachPassedAssertion(assertion);

        this.appendLog(chalk.green('.'));
    }
}
