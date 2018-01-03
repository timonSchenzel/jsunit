const concordance = require('concordance');
const AssertionResult = require('./src/AssertionResult');

let AssertionsClass = class Assertions
{
    constructor()
    {
        this.assertions = {
            pass: (message) =>
            {
                return {
                    pass: true,
                    message,
                };
            },

            fail: (message) =>
            {
                return {
                    pass: false,
                    message,
                };
            },

            assertTrue: (actual, message) =>
            {
                return {
                    pass: actual == true,
                    message,
                    expected: true,
                    actual,
                };
            },

            assertFalse: (actual, message) =>
            {
                return {
                    pass: actual == false,
                    message,
                    expected: false,
                    actual,
                };
            },

            assertEquals: (expected, actual, message) =>
            {
                return {
                    pass: concordance.compare(actual, expected).pass == true,
                    message,
                    expected,
                    actual,
                };
            },

            assertNotEquals: (expected, actual, message) =>
            {
                return {
                    pass: concordance.compare(actual, expected).pass == false,
                    message,
                    expected,
                    actual,
                };
            },

            assertCount: (expected, countable, message) =>
            {
                try {
                    return this.pipe('assertEquals', [expected, Object.keys(countable).length, message]);
                } catch (error) {
                    return this.pipe('fail', [`[${countable}] is not countable.`]);
                }
            },

            assertContains: (regex, contents, message) =>
            {
                if (typeof regex == 'string') {
                    regex = new RegExp(regex, 'gim');
                }

                return {
                    pass: regex.test(contents) == true,
                    message,
                    contents,
                    regex,
                };
            },

            assertNotContains: (regex, contents, message) =>
            {
                if (typeof regex == 'string') {
                    regex = new RegExp(regex, 'gim');
                }

                return {
                    pass: regex.test(contents) == false,
                    message,
                    contents,
                    regex,
                };
            }
        };
    }

    execute(assertion, parameters)
    {
        let result = new AssertionResult(assertion, this.assertions[assertion](...parameters));
        return result;
    }

    pipe(assertion, parameters)
    {
        return this.assertions[assertion](...parameters);
    }
}

let proxy = {
    get(target, property, receiver)
    {
        if (typeof target[property] == 'function') {
            return function(...args) {
               return target[property](...args);
            };
        }

        if (target[property] !== undefined) {
            return target[property];
        }

        if (typeof target.assertions[property] == 'function') {
            return function(...args) {
                return target.execute(property, args);
            };
        }

        if (target.assertions[property] !== undefined) {
            return target.assertions[property];
        }
    }
};
let Assertions = new Proxy(new AssertionsClass, proxy);

let objects = [1, 2];
let result = Assertions.assertCount(2, objects);
console.log(result);

console.log(Assertions.execute('assertTrue', [false]));
