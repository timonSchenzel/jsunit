#!/usr/bin/env node
let results = {};

const { fork } = require('child_process');
// const testRun = spawn('src/ava/runner.js src/jsunit.js --colors --tap | ./src/tap-nodue/tap-nodue.js', {
const testRun = fork('src/jsunit.js', {
    stdio: 'inherit',
    shell: true,
});

testRun.on('message', (data) => {
    results[data.name] = data.assertion;
});

testRun.on('exit', function (code, signal) {
    console.log(results);
});
