#!/usr/bin/env node
try {
	require('./cli').run();
} catch (err) {
	console.error(`\n  ${err.message}`);
	process.exit(1);
}
