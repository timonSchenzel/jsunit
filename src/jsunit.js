#!/usr/bin/env node
require('jsdom-global')();

global.path = require('path');

/**
 * Load fs module.
 */
global.fs = require('fs');

/**
 * Load safe-eval package, Safer version of eval().
 */
global.safeEval = require('safe-eval');

/**
 * Load concordance package, Compare, format, diff and serialize any JavaScript value.
 */
global.concordance = require('concordance');

/**
 * Load figures package, will make unicode symbols available for terminal/cmd.
 */
global.figures = require('figures');

/**
 * Load cheerio package, Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
 */
global.cheerio = require('cheerio');

/**
 * Load moment package, Parse, validate, manipulate, and display dates in javascript.
 */
global.moment = require('moment');

/**
 * Load sinon package, Test spies, stubs and mocks for JavaScript.
 */
global.sinon = require('sinon');

/**
 * Load stack-trace package. Get v8 stack traces as an array of CallSite objects.
 */
global.stackTrace = require('stack-trace');

/**
 * Load AssertionResult class.
 */
global.AssertionResult = require('./assertions/AssertionResult');

/**
 * Load Reporter class.
 */
global.Reporter = require('./reporters/Reporter');

/**
 * Load TestCase class.
 */
global.TestCase = require('./TestCase');

/**
 * Load chalk package, terminal/cmd string styling done right.
 */
global.chalk = require('chalk');

/**
 * Load jsUnit's test runner class.
 */
let TestRunner = require('./TestRunner');

/**
 * Create a new TestRunner instance
 * and pass the current process to it.
 */
let jsUnit = new TestRunner(process);

(async () => {
    /**
     * Boot jsUnit, basically this will read the config file "jsunit.js".
     * If a bootstrap file is provided it will load this fill.
     * Further it scan all provided locations and get the test classes.
     * @todo: set env stuff.
     */
    try {
        await jsUnit.boot();
    } catch (error) {
        console.error(chalk.red(`  ${figures.cross} jsUnit bootstrap error`));
        console.log(error);
    }

    /**
     * Finally, Run all tests found in all the test classes.
     */
    try {
        await jsUnit.test();
    } catch (error) {
        console.error(chalk.red(`  ${figures.cross} jsUnit error`));
        console.log(error);
    }
})();
