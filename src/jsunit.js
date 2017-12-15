#!/usr/bin/env node
require('jsdom-global')();

let startDate = new Date();

let annotations = require('./utilities/annotations');

/**
 * Load fs module.
 *
 * @type {Object}
 */
global.fs = require('fs');

/**
 * Load ava's test framework.
 *
 * @type {Object}
 */
// global.test = require('ava');

/**
 * Load figures package, will make unicode symbols available for terminal/cmd.
 *
 * @type {Object}
 */
global.figures = require('figures');

/**
 * Load cheerio package, Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
 *
 * @type {Object}
 */
global.cheerio = require('cheerio');

/**
 * Load moment package, Parse, validate, manipulate, and display dates in javascript.
 *
 * @type {Object}
 */
global.moment = require('moment');

/**
 * Load sinon package, Test spies, stubs and mocks for JavaScript.
 *
 * @type {Object}
 */
global.sinon = require('sinon');

/**
 * Load stack-trace package. Get v8 stack traces as an array of CallSite objects.
 *
 * @type {Object}
 */
global.stackTrace = require('stack-trace');

/**
 * Load Reporter class.
 *
 * @type {Object}
 */
global.Reporter = require('./reporters/Reporter');

/**
 * Load TestCase class.
 *
 * @type {Object}
 */
global.TestCase = require('./TestCase');

/**
 * Load chalk package, terminal/cmd string styling done right.
 *
 * @type {Object}
 */
global.chalk = require('chalk');

/**
 * Load jsUnit's test runner class.
 *
 * @type {TestRunner}
 */
let TestRunner = require('./TestRunner');

/**
 * Create a new TestRunner instance
 * and pass the current process to it.
 *
 * @type {TestRunner}
 */
let jsUnit = new TestRunner(process);

(async () => {
    /**
     * Boot jsUnit, basically this will read the config file "jsunit.json".
     * If a bootstrap file is provided it will load this fill.
     * Further it scan all provided locations and get the test classes.
     * @todo: set env stuff.
     */
    await jsUnit.boot();

    /**
     * Finally, Run all tests found in all the test classes.
     */
    await jsUnit.test();

    // console.log(`\n  ${jsUnit.executedTests} test${jsUnit.executedTests != 1 ? 's' : ''}`);
})();
