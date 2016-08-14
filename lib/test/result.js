'use strict';

var tape = require('tape');

var Result = require('../result.js');

/**
 * bad status
 */
tape('FAIL no redirects (not expected)', function (t) {
  var test = Test('https://www.soundcasts.net', 'https://www.soundcasts.net');
  var response = Response([], 404);
  var result = Result(test, response);
  ok(t, result, false, 'FAIL', 'HTTP status code was 404');
});

/**
 * no redirects
 */
tape('PASS no redirects (not expected)', function (t) {
  var test = Test('https://www.soundcasts.net');
  var response = Response([]);
  var result = Result(test, response);
  ok(t, result, true, 'PASS');
});

tape('FAIL no redirects (one expected)', function (t) {
  var test = Test('http://www.soundcasts.net', 'https://www.soundcasts.net');
  var response = Response([]);
  var result = Result(test, response);
  ok(t, result, false, 'FAIL', 'Expected redirect to https://www.soundcasts.net but was not redirected');
});

/**
 * one redirect
 */
tape('PASS one redirect (one expected)', function (t) {
  var test = Test('http://soundcasts.net', 'https://www.soundcasts.net');
  var response = Response(['https://www.soundcasts.net']);
  var result = Result(test, response);
  ok(t, result, true, 'PASS');
});

tape('FAIL one redirect (none expected)', function (t) {
  var test = Test('https://www.soundcasts.net');
  var response = Response(['https://www.soundcasts.net/index.html']);
  var result = Result(test, response);
  ok(t, result, false, 'FAIL', 'Expected no redirects, but was redirected to https://www.soundcasts.net/index.html');
});

/**
 * multiple redirects
 */
tape('WARN two redirects (one expected)', function (t) {
  var test = Test('http://soundcasts.net', 'https://www.soundcasts.net');
  var response = Response(['https://soundcasts.net', 'https://www.soundcasts.net']);
  var result = Result(test, response);
  ok(t, result, false, 'WARN', 'Expected just one redirect, but got 2');
});

tape('WARN two redirects (none expected)', function (t) {
  var test = Test('https://www.soundcasts.net');
  var response = Response(['https://soundcasts.net', 'https://www.soundcasts.net']);
  var result = Result(test, response);
  ok(t, result, false, 'WARN', 'Expected no redirects, but got 2');
});

tape('FAIL two redirects (none expected)', function (t) {
  var test = Test('https://www.soundcasts.net');
  var response = Response(['http://www.soundcasts.net', 'http://soundcasts.net']);
  var result = Result(test, response);
  ok(t, result, false, 'FAIL', 'Expected no redirects, but was redirected to http://soundcasts.net');
});

function Test(url) {
  var to = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var actualTo = to.length ? [to] : to;
  return {
    url: url,
    to: actualTo
  };
}

function Response(redirects) {
  var status = arguments.length <= 1 || arguments[1] === undefined ? 200 : arguments[1];

  return {
    redirects: redirects,
    status: status
  };
}

function ok(t, result, pass, status) {
  var message = arguments.length <= 4 || arguments[4] === undefined ? '' : arguments[4];

  t.equal(result.message, message, 'message');
  t.equal(result.pass, pass, 'pass');
  t.ok(result.response, 'response');
  t.equal(result.status, status, 'status');
  t.end();
}