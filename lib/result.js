'use strict';

function Result(test, res) {
  var result = {
    message: String,
    pass: Boolean,
    response: res,
    status: String
  };

  // FAIL
  // no response
  if (res.error) {
    result.message = res.error;
    result.pass = false;
    result.response = undefined;
    result.status = 'FAIL';
    return result;
  }

  var redirects = res.redirects;
  var redirectsExpected = test.to.length > 0;
  var redirected = redirects.length > 0;
  var multipleRedirects = res.redirects.length > 1;
  var ok = res.status === 200;
  var to = redirects[redirects.length - 1];

  // FAIL
  // non-200 http status
  if (!ok) {
    result.message = 'HTTP status code was ' + res.status;
    result.status = 'FAIL';
  }

  // FAIL
  // expected but got no redirects
  else if (redirectsExpected && !redirected) {
      result.message = 'Expected redirect to ' + test.to[0] + ' but was not redirected';
      result.status = 'FAIL';
    }

    // ????
    // expected and got redirects
    else if (redirectsExpected && redirected) {

        // WARN
        // multiple redirects
        if (multipleRedirects) {
          result.message = 'Expected just one redirect, but got ' + redirects.length;
          result.status = 'WARN';
        }

        // PASS
        // redirected correctly
        else if (test.to.indexOf(to) > -1) {
            result.message = '';
            result.status = 'PASS';
          }

          // FAIL
          // redirected incorrectly
          else if (!test.to.indexOf(to) > -1) {
              result.message = 'Expected redirect to ' + test.to[0] + ', but was redirected to ' + to;
              result.status = 'FAIL';
            }
      }

      // ????
      // not expected but got redirected
      else if (!redirectsExpected && redirected) {

          // WARN
          // redirected "correctly"
          if (test.url === to) {
            result.message = 'Expected no redirects, but got ' + redirects.length;
            result.status = 'WARN';
          }

          // FAIL
          // redirected incorrectly
          else if (!test.to.indexOf(to) > -1) {
              result.message = 'Expected no redirects, but was redirected to ' + to;
              result.status = 'FAIL';
            } else neverHappen();
        }

        // PASS
        // no redirects expected or received
        else if (!redirectsExpected && !redirected) {
            result.message = '';
            result.status = 'PASS';
          }

  if (result.status === String) throw new Error('This should never happen!');
  result.pass = result.status === 'PASS';

  return result;
}

function neverHappen() {
  throw 'this should never happen';
}

module.exports = Result;