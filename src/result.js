function Result(test, res) {
  const result = {
    pass: '',
    status: '',
  };

  // no redirects
  if (!res.redirects.length) {
    console.log('no redirects');
    result.status = test.url === test.to ? 'PASS' : 'FAIL';
    result.actual = 'wtf';
  }
  else {
    console.log('redirects', res.redirects);
    const ok = test.to === res.headers.location;
    const multiple = res.redirects > 1;
    const pass = ok && !multiple;
    result.status = pass ? 'PASS' : (
      ok ? 'WARN' : 'FAIL'
    );

    result.actual = 'asdfasfd';
  }

  result.pass = result.status === 'PASS';

  return result;
}


module.exports = Result;
