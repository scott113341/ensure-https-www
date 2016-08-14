#!/usr/bin/env node
'use strict';

var chalk = require('chalk');
var fs = require('fs');
var request = require('superagent');

var Result = require('./result.js');

var args = process.argv.slice(2);
var domain = args[0];
var path = args[1];

var toRoot = ['https://www.' + domain + '/', 'https://www.' + domain];
var toPath = ['https://www.' + domain + path, 'https://www.' + domain + path + '/'];
var toSelf = [];

var tests = [{ url: 'http://' + domain + '/', to: toRoot }, { url: 'http://www.' + domain + '/', to: toRoot }, { url: 'https://' + domain + '/', to: toRoot }, { url: 'https://www.' + domain + '/', to: toSelf }, { url: 'http://' + domain + path, to: toPath }, { url: 'http://www.' + domain + path, to: toPath }, { url: 'https://' + domain + path, to: toPath }, { url: 'https://www.' + domain + path, to: toSelf }];

var promises = tests.map(function (test) {
  return request.get(test.url).then(function (res) {
    test.result = Result(test, res);
    return test;
  }).catch(function (err) {
    test.result = Result(test, err.response);
    return test;
  });
});

Promise.all(promises).then(function (tests) {
  var colors = {
    FAIL: chalk.red('FAIL'),
    PASS: chalk.green('PASS'),
    WARN: chalk.yellow('WARN')
  };
  tests.forEach(function (test) {
    var result = test.result;
    console.log(colors[result.status] + ' ' + test.url);
    if (!result.pass) console.log('     ' + result.message);
  });

  var anyFailed = tests.find(function (t) {
    return !t.result.pass;
  });
  if (anyFailed) process.exit(1);
});