#!/usr/bin/env node
const { fork } = require('child_process');
// const testRun = spawn('src/ava/runner.js src/jsunit.js --colors --tap | ./src/tap-nodue/tap-nodue.js', {
const testRun = fork('src/jsunit.js', {
    stdio: 'inherit',
    shell: true,
});

testRun.on('message', (data) => {
    console.log(data);
});

