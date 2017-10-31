module.exports = class TestRunner
{
	constructor(processData)
	{
		this.configFile = 'jsunit.json';

		this.fs = require('fs');

		this.pathModule = require('path');

		this.fileLoader = require('auto-loader');

		this.annotations = require('./utilities/annotations');

		this.process = processData;

		this.root = this.pathModule.normalize(__dirname + '/../');

		this.pwd = processData.env.PWD + '/';

		this.config = {};

		this.locations = [];

		this.rawFilter = processData.env.npm_lifecycle_script;

        this.filter = this.parseFilter(this.rawFilter);

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
			this.config = JSON.parse(this.fs.readFileSync(this.configFile, 'utf8'));
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

	boot()
	{
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
	}

	async test()
	{
        try {
    		for (let location in this.locations) {
    			await this.runTestsInLocation(location);
    		}
        } catch (error) {
            console.error(chalk.red(`  ${figures.cross} jsUnit error`));
            console.error(error);

            process.exit(0);
        }
	}

	async runTestsInClass(testClass, path, location)
	{
		let annotations = this.annotations.getSync(this.path(`${location}/${path}.js`));
        let invokeSetUp = false;

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

            // Invoke setUp method if exists
            if (typeof testClass['setUp'] == 'function' && ! invokeSetUp) {
                invokeSetUp = true;
                testClass.name = path + ' -> ' + 'setUp';
                testClass['setUp']();
            }

		    testClass.name = path + ' -> ' + name;

            try {
                await testClass[name]();
            } catch (error) {
                if (error.message.startsWith('[vue-test-utils]')) {
                    console.error(chalk.red(`  Vue utils error`));
                    console.error(error);

                    process.exit(0);
                } else {
                    throw error;
                }
            }
		}

        // Invoke tearDown method
        if (typeof testClass['tearDown'] == 'function') {
            testClass.name = path + ' -> ' + 'tearDown';
            testClass['tearDown']();
        }
	}

	async runTestsInLocation(location)
	{
        let testFiles = this.getTestFilesInLocation(this.locations[location]);

        for (let filePath in testFiles) {
        	await this.runTestsInClass(new testFiles[filePath](), filePath, location);
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
		return this.pathModule.normalize(this.root + additionalPath);
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
