module.exports = class AssertionResult
{
	constructor(results = {})
	{
		this.pass = results['pass'];
		delete results['pass'];
		this.results = results;
	}
}
