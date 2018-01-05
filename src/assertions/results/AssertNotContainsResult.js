module.exports = class AssertNotContainsResult extends AssertionResult
{
    describeFailure()
    {
        return `Value must not match expression:\n\n  ${this.contents}\n\n  Regular expression:\n\n  ${this.regex}`;
    }
}
