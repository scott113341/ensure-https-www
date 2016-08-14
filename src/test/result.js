const tape = require('tape');

const Result = require('../result.js');


/**
 * bad status
 */
tape('FAIL no redirects (not expected)', t => {
  const test = Test('https://www.soundcasts.net', 'https://www.soundcasts.net');
  const response = Response([], 404);
  const result = Result(test, response);
  ok(t, result, false, 'FAIL', 'HTTP status code was 404');
});


/**
 * no redirects
 */
tape('PASS no redirects (not expected)', t => {
  const test = Test('https://www.soundcasts.net');
  const response = Response([]);
  const result = Result(test, response);
  ok(t, result, true, 'PASS');
});

tape('FAIL no redirects (one expected)', t => {
  const test = Test('http://www.soundcasts.net', 'https://www.soundcasts.net');
  const response = Response([]);
  const result = Result(test, response);
  ok(t, result, false, 'FAIL', 'Expected redirect to https://www.soundcasts.net but was not redirected');
});


/**
 * one redirect
 */
tape('PASS one redirect (one expected)', t => {
  const test = Test('http://soundcasts.net', 'https://www.soundcasts.net');
  const response = Response(['https://www.soundcasts.net']);
  const result = Result(test, response);
  ok(t, result, true, 'PASS');
});

tape('FAIL one redirect (none expected)', t => {
  const test = Test('https://www.soundcasts.net');
  const response = Response(['https://www.soundcasts.net/index.html']);
  const result = Result(test, response);
  ok(t, result, false, 'FAIL', 'Expected no redirects, but was redirected to https://www.soundcasts.net/index.html');
});


/**
 * multiple redirects
 */
tape('WARN two redirects (one expected)', t => {
  const test = Test('http://soundcasts.net', 'https://www.soundcasts.net');
  const response = Response(['https://soundcasts.net', 'https://www.soundcasts.net']);
  const result = Result(test, response);
  ok(t, result, false, 'WARN', 'Expected just one redirect, but got 2');
});

tape('WARN two redirects (none expected)', t => {
  const test = Test('https://www.soundcasts.net');
  const response = Response(['https://soundcasts.net', 'https://www.soundcasts.net']);
  const result = Result(test, response);
  ok(t, result, false, 'WARN', 'Expected no redirects, but got 2');
});

tape('FAIL two redirects (none expected)', t => {
  const test = Test('https://www.soundcasts.net');
  const response = Response(['http://www.soundcasts.net', 'http://soundcasts.net']);
  const result = Result(test, response);
  ok(t, result, false, 'FAIL', 'Expected no redirects, but was redirected to http://soundcasts.net');
});


function Test(url, to=[]) {
  const actualTo = to.length ? [ to ] : to;
  return {
    url,
    to: actualTo,
  };
}

function Response(redirects, status=200) {
  return {
    redirects,
    status,
  };
}

function ok(t, result, pass, status, message='') {
  t.equal(result.message, message, 'message');
  t.equal(result.pass, pass, 'pass');
  t.ok(result.response, 'response');
  t.equal(result.status, status, 'status');
  t.end();
}
