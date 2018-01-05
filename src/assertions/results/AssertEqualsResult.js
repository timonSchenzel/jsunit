module.exports = class AssertTrueResult extends AssertionResult
{
    describeFailure()
    {
        return `--- Expected\n  +++ Actual\n  @@ @@\n  - ${this.expected}\n  + ${this.actual}`;
    }
}
