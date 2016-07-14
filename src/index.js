const chalk = require('chalk');
const fs = require('fs');
const leftPad = require('left-pad');
const request = require('superagent');


const args = process.argv.slice(2);
const domain = args[0];
const path = args[1];

const toRoot = `https://www.${domain}/`;
const toPath = `https://www.${domain}${path}`;

const tests = [
  { url: `http://${domain}`,             to: toRoot, ok: null },
  { url: `http://www.${domain}`,         to: toRoot, ok: null },
  { url: `https://${domain}`,            to: toRoot, ok: null },
  { url: `https://www.${domain}`,        to: toRoot, ok: null },
  { url: `http://${domain}${path}`,      to: toPath, ok: null },
  { url: `http://www.${domain}${path}`,  to: toPath, ok: null },
  { url: `https://${domain}${path}`,     to: toPath, ok: null },
  { url: `https://www.${domain}${path}`, to: toPath, ok: null },
];

const promises = tests.map(test => {
  return request
    .get(test.url)
    .redirects(0)
    .then(res => {
      test.ok = true;
      test.actual = test.to;
      return test;
    })
    .catch(res => {
      test.ok = res.response.headers.location === test.to;
      test.actual = res.response.headers.location;
      return test;
    });
});

Promise.all(promises)
  .then(results => {
    const longestUrl = [...results].sort((a, b) => b.url.length - a.url.length)[0].url.length;

    results.forEach(result => {
      const status = result.ok ? chalk.green('PASS') : chalk.red('FAIL');
      console.log(`${status} ${leftPad(result.url, longestUrl)} => ${result.to}`);
    });

    const anyFailed = results.find(r => r.ok !== true);
    if (anyFailed) process.exit(1);
  });
