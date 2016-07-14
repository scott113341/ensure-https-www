#!/usr/bin/env node
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var chalk = require('chalk');
var fs = require('fs');
var leftPad = require('left-pad');
var request = require('superagent');

var args = process.argv.slice(2);
var domain = args[0];
var path = args[1];

var toRoot = 'https://www.' + domain + '/';
var toPath = 'https://www.' + domain + path;

var tests = [{ url: 'http://' + domain, to: toRoot, ok: null }, { url: 'http://www.' + domain, to: toRoot, ok: null }, { url: 'https://' + domain, to: toRoot, ok: null }, { url: 'https://www.' + domain, to: toRoot, ok: null }, { url: 'http://' + domain + path, to: toPath, ok: null }, { url: 'http://www.' + domain + path, to: toPath, ok: null }, { url: 'https://' + domain + path, to: toPath, ok: null }, { url: 'https://www.' + domain + path, to: toPath, ok: null }];

var promises = tests.map(function (test) {
  return request.get(test.url).redirects(0).then(function (res) {
    test.ok = true;
    test.actual = test.to;
    return test;
  }).catch(function (res) {
    test.ok = res.response.headers.location === test.to;
    test.actual = res.response.headers.location;
    return test;
  });
});

Promise.all(promises).then(function (results) {
  var longestUrl = [].concat(_toConsumableArray(results)).sort(function (a, b) {
    return b.url.length - a.url.length;
  })[0].url.length;

  results.forEach(function (result) {
    var status = result.ok ? chalk.green('PASS') : chalk.red('FAIL');
    console.log(status + ' ' + leftPad(result.url, longestUrl) + ' => ' + result.to);
  });

  var anyFailed = results.find(function (r) {
    return r.ok !== true;
  });
  if (anyFailed) process.exit(1);
});