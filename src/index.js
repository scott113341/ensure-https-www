#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const leftPad = require('left-pad');
const request = require('superagent');

const Result = require('./result.js');


const args = process.argv.slice(2);
const domain = args[0];
const path = args[1];

const toRoot = `https://www.${domain}/`;
const toPath = `https://www.${domain}${path}`;

const tests = [
  { url: `http://${domain}`,             to: toRoot },
  { url: `http://www.${domain}`,         to: toRoot },
  { url: `https://${domain}`,            to: toRoot },
  { url: `https://www.${domain}`,        to: toRoot },
  { url: `http://${domain}${path}`,      to: toPath },
  { url: `http://www.${domain}${path}`,  to: toPath },
  { url: `https://${domain}${path}`,     to: toPath },
  { url: `https://www.${domain}${path}`, to: toPath },
];

const promises = tests.map(test => {
  return request
    .get(test.url)
    .then(res => {
      test.result = Result(test, res);
      console.log(test.result);
      return test;
    })
    .catch(res => {
      test.ok = false;
      test.actual = res.response.headers.location;
      return test;
    });
});

Promise.all(promises)
  .then(tests => {
    const longestUrl = [...tests].sort((a, b) => b.url.length - a.url.length)[0].url.length;

    tests.forEach(test => {
      const status = test.result.status;
      const actual = test.result.pass ? '' : ` expected, but got ${test.result.actual}`;
      console.log(`${status} ${leftPad(test.url, longestUrl)} => ${test.to}${actual}`);
    });

    const anyFailed = tests.find(r => r.ok !== true);
    if (anyFailed) process.exit(1);
  })
  .catch(e => {
    console.log(e);
    return e;
  });
