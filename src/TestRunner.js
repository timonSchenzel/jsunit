module.exports = class TestRunner
{
	constructor(processData)
	{
		this.configFile = 'jsunit.js';

		this.fs = require('fs');

		this.pathModule = require('path');

		this.fileLoader = require('auto-loader');

		this.annotations = require('./utilities/annotations');

		this.process = processData;

		this.root = processData.env.PWD + '/';

		this.pwd = processData.env.PWD + '/';

        this.firstAssertionHit = true;

        this.totalAssertions = 0;

        this.executedTests = 0;

        this.reporter = null;

		this.config = {};

		this.locations = [];

		this.rawFilter = processData.env.npm_lifecycle_script;

        this.filter = this.parseFilter(this.rawFilter);
        this.filter = processData.argv.slice(2)[0];

		this.loadConfig();

        this.annotationFilter = 'test';

        if (this.filter && this.filter.startsWith('@')) {
            this.annotationFilter = this.filter.replace('@', '');
            this.filter = '';
        }
	}

	loadConfig()
	{
		if (this.fs.existsSync(this.configFile)) {
			this.config = require(this.root + this.configFile);
		} else {
            this.config = require('./defaultConfig');
        }

        if (this.config.reporter) {
            this.loadReporter(this.config.reporter);
        }
	}

    loadReporter(reporter)
    {
        try {
            if (typeof reporter == 'string') {
                this.reporter = new (require(reporter));
            }

            if (typeof reporter == 'function') {
                this.reporter = reporter;
            }
        } catch (error) {
            console.error(chalk.red(`  ${figures.cross} jsUnit error`));
            console.error(error);

            process.exit(0);
        }
    }

	parseFilter(rawFilter = '')
	{
		let searchFilter = rawFilter.match(/"((?:\\.|[^"\\])*)"/);

		if (typeof searchFilter === 'object' && searchFilter !== null) {
			return searchFilter[1];
		}

		return null;
	}

	async boot()
	{
        await this.reporter.beforeBoot();

        // Load vue specific stuff
        /**
         * Load VueComponentTestCase class.
         *
         * @type {Object}
         */
        global.VueComponentTestCase = require('./VueComponentTestCase');

        /**
         * Load VueComponentTester class.
         *
         * @type {Object}
         */
        global.VueComponentTester = require('./VueComponentTester');

        /**
         * Load VueTestUtils class.
         *
         * @type {Object}
         */
        global.vueTestUtils = require('vue-test-utils');

        /**
         * Load Vue.
         *
         * @type {Object}
         */
        if (! this.config.vue.require) {
            this.config.vue.require = () => {
                require('vue');
            }
        }

        global.Vue = global[this.config.vue] = this.config.vue.require();

        Vue.config.productionTip = false;
        Vue.config.debug = false;
        Vue.config.silent = true;
        Vue.config.devtools = false;

		try {
			if (this.config.bootstrap) {
				require(this.path(this.config.bootstrap));
			}
		} catch (error) {
            if (error instanceof Error && error.code === 'MODULE_NOT_FOUND') {
                console.error(`  ${chalk.red(figures.cross)} Bootstrap file [${this.config.bootstrap}] don't exists.`);
            } else {
                console.error(chalk.red(`  ${figures.cross} jsUnit bootstrap error`));
                console.log(error);
            }

			process.exit(0);
		}

		this.getTestLocations();

        await this.reporter.afterBoot();
	}

	async test(callback)
	{
        await this.reporter.beforeTest();

        try {
    		for (let location in this.locations) {
    			await this.runTestsInLocation(location);
            }
        } catch (error) {
            console.error(chalk.red(`  ${figures.cross} jsUnit error`));
            console.error(error);

            process.exit(0);
        }

        await this.reporter.afterTest();
	}

	async runTestsInClass(testClass, path, location)
	{
		let annotations = this.annotations.getSync(this.path(`${location}/${path}.js`));
        let invokedSetUp = false;
        let testClassMethodIsHit = false;

        for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(testClass))) {
			let hasCorrectAnnotation = false;
		    let method = testClass[name];

		    if (typeof annotations[name] == 'object') {
                hasCorrectAnnotation = annotations[name][this.annotationFilter] === true;
            }

		    // Default filters:
		    // 1. Skip constructor
		    // 2. Only call methods with a 'test' prefix or a correct annotation, by default this will be 'test'
            if ( ! method instanceof Function || method === testClass || name == 'constructor' || (! name.startsWith('test') && ! hasCorrectAnnotation)) {
                continue;
            }

            // If a custom annotation filter is specified,
            // only run tests with that specific annotation.
            // This will skip tests with prefix 'test'.
            if (this.annotationFilter != 'test' && ! hasCorrectAnnotation) {
                continue;
            }

            // Apply cli filter
            if (this.filter && name != this.filter && testClass.constructor.name != this.filter) {
                continue;
            }

            this.totalAssertions++;

            if (this.firstAssertionHit) {
                this.firstAssertionHit = false;
                process.stdout.write('  ');
            }

            testClassMethodIsHit = true;

            // Invoke setUp method if exists
            if (typeof testClass['setUp'] == 'function' && ! invokedSetUp) {
                this.executedTests++;
                invokedSetUp = true;
                testClass.name = path + ' -> ' + 'setUp';
                testClass['setUp']();
            }

            // Invoke beforeEach method if exists
            // @todo: create test for this feature
            if (typeof testClass['beforeEach'] == 'function') {
                testClass.name = path + ' -> ' + 'beforeEach';
                testClass['beforeEach']();
            }

            testClass.test = { file: path, function: name };

            try {
                await testClass[name]();

                // Invoke afterEach method if exists
                // @todo: create test for this feature
                if (typeof testClass['afterEach'] == 'function') {
                    testClass.name = path + ' -> ' + 'afterEach';
                    testClass['afterEach']();
                }
            } catch (error) {
                if (error.message.startsWith('[vue-test-utils]')) {
                    console.error(chalk.red(`  Vue utils error`));
                    console.error(error);

                    process.exit(0);
                } else {
                	let expectedException = testClass.expectedException;
                	let expectedExceptionMessage = testClass.expectedExceptionMessage;
                	let notExpectedException = testClass.notExpectedException;

                    if ((expectedException && expectedException.name) || (notExpectedException && notExpectedException.name)) {
                        if (expectedException && expectedException.name) {
                            // test(testClass.visualError(error.stack, testClass.name), t => {
                            //     t.is(expectedException.name, error.name, `Assert that exception [${expectedException.name}] was thrown, but is was not.`);
                            // });
                        }

                        if(notExpectedException && notExpectedException.name) {
                            // test(testClass.visualError(error.stack, testClass.name), t => {
                            //     t.not(notExpectedException.name, error.name, `Assert that exception [${notExpectedException.name}] was not thrown, but is was.`);
                            // });
                        }
                    } else {
                        throw error;
                    }
                }

                testClass['cleanupAfterSingleTestMethod']();
            }
		}

        // Invoke tearDown method
        if (typeof testClass['tearDown'] == 'function' && testClassMethodIsHit) {
            testClass.name = path + ' -> ' + 'tearDown';
            testClass['tearDown']();
        }
	}

	async runTestsInLocation(location)
	{
        let testFiles = this.getTestFilesInLocation(this.locations[location]);

        for (let filePath in testFiles) {
            let testClass = new testFiles[filePath]();
            testClass.reporter = this.reporter;
            testClass.assertions = Assertions;

            // let testClass = new Proxy(
            //     testClassInstance,
            //     AssertionsProxy
            // );

            await this.reporter.beforeEachTest(filePath);

        	await this.runTestsInClass(testClass, filePath, location);

            await this.reporter.afterEachTest(this.reporter.results[filePath]);
        }
    }

    getTestFilesInLocation(object)
    {
    	let testFilePaths = {};

        for (let i in object) {
            if (! object.hasOwnProperty(i)) continue;

            if ((typeof object[i]) == 'object') {
                let flatObject = this.getTestFilesInLocation(object[i]);
                for (let x in flatObject) {
                    if (! flatObject.hasOwnProperty(x)) continue;

                    if (x.toLowerCase().endsWith('test')) {
                        testFilePaths[i + '/' + x] = flatObject[x];
                    }
                }
            } else {
                if (i.toLowerCase().endsWith('test')) {
                    testFilePaths[i] = object[i];
                }
            }
        }

        return testFilePaths;
    }

	getTestLocations()
	{
		let fileLocations = this.config.files;

		if (! fileLocations) {
			process.exit(0);
		}

		fileLocations.forEach(location => {
			this.locations[location] = this.loadFilesFrom(location);
		});

		return this.locations;
	}

	path(additionalPath)
	{
		return this.root + additionalPath;
	}

	loadFilesFrom(path)
	{
        try {
            if(this.fs.lstatSync(path).isDirectory() == false) {
                return require(this.path(path));
            }
		} catch (error) {
			if (error instanceof Error && error.code === 'ENOENT') {
				console.error(chalk.red(`  ${figures.cross} Directory [${path}] don't exists.`));
			} else {
                console.error(chalk.red(`  jsUnit error`));
                console.error(error);
            }

			process.exit(0);
		}

		return this.fileLoader.load(this.path(path));
	}
}
