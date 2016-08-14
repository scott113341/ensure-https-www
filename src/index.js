#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const request = require('superagent');

const Result = require('./result.js');


const args = process.argv.slice(2);
const domain = args[0];
const path = args[1];

const toRoot = [
  `https://www.${domain}/`,
  `https://www.${domain}`,
];
const toPath = [
  `https://www.${domain}${path}`,
  `https://www.${domain}${path}/`,
];
const toSelf = [];

const tests = [
  { url: `http://${domain}/`,            to: toRoot },
  { url: `http://www.${domain}/`,        to: toRoot },
  { url: `https://${domain}/`,           to: toRoot },
  { url: `https://www.${domain}/`,       to: toSelf },
  { url: `http://${domain}${path}`,      to: toPath },
  { url: `http://www.${domain}${path}`,  to: toPath },
  { url: `https://${domain}${path}`,     to: toPath },
  { url: `https://www.${domain}${path}`, to: toSelf },
];

const promises = tests.map(test => {
  return new Promise(resolve => {
    request
      .get(test.url)
      .end((err, res) => {
        var response;
        if (err && !err.response) response = { error: err.message };
        else if (err) response = err.response;
        else response = res;

        test.result = Result(test, response);
        resolve(test);
      });
  });
});

Promise.all(promises)
  .then(tests => {
    const colors = {
      FAIL: chalk.red('FAIL'),
      PASS: chalk.green('PASS'),
      WARN: chalk.yellow('WARN'),
    };
    tests.forEach(test => {
      const result = test.result;
      console.log(`${colors[result.status]} ${test.url}`);
      if (!result.pass) console.log(`     ${result.message}`);
    });

    const anyFailed = tests.find(t => !t.result.pass);
    if (anyFailed) process.exit(1);
  });
