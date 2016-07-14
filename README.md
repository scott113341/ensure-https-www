# ensure-https-www

[![npm-version][npm-version-badge]][npm-version-href]
[![build-status][build-status-badge]][build-status-href]
[![dependencies][dependencies-badge]][dependencies-href]
[![dev-dependencies][dev-dependencies-badge]][dev-dependencies-href]


Ensure your domain redirects non-https non-www requests appropriately.


### Example

Here's how a properly configured domain looks:

```text
$ ensure-https-www soundcasts.net /bundle.js
PASS                http://soundcasts.net => https://www.soundcasts.net/
PASS            http://www.soundcasts.net => https://www.soundcasts.net/
PASS               https://soundcasts.net => https://www.soundcasts.net/
PASS           https://www.soundcasts.net => https://www.soundcasts.net/
PASS      http://soundcasts.net/bundle.js => https://www.soundcasts.net/bundle.js
PASS  http://www.soundcasts.net/bundle.js => https://www.soundcasts.net/bundle.js
PASS     https://soundcasts.net/bundle.js => https://www.soundcasts.net/bundle.js
PASS https://www.soundcasts.net/bundle.js => https://www.soundcasts.net/bundle.js
```

And here's how an improperly configured domain looks:

```text
$ ensure-https-www nytimes.com /es/
FAIL          http://nytimes.com => https://www.nytimes.com/ expected, but got http://www.nytimes.com/
PASS      http://www.nytimes.com => https://www.nytimes.com/
FAIL         https://nytimes.com => https://www.nytimes.com/ expected, but got http://www.nytimes.com/
FAIL     https://www.nytimes.com => https://www.nytimes.com/ expected, but got http://www.nytimes.com/
FAIL      http://nytimes.com/es/ => https://www.nytimes.com/es/ expected, but got http://www.nytimes.com/es/
PASS  http://www.nytimes.com/es/ => https://www.nytimes.com/es/
FAIL     https://nytimes.com/es/ => https://www.nytimes.com/es/ expected, but got http://www.nytimes.com/es/
PASS https://www.nytimes.com/es/ => https://www.nytimes.com/es/
```


### Usage

```usage
usage: ensure-https-www <domain> <path>

domain
  the non-www domain you want to test
  example: soundcasts.net

path
  a path you want to test
  example: /bundle.js
```


[npm-version-badge]: https://img.shields.io/npm/v/ensure-https-www.svg?style=flat-square
[npm-version-href]: https://www.npmjs.com/package/ensure-https-www

[build-status-badge]: https://img.shields.io/travis/scott113341/ensure-https-www/master.svg?style=flat-square
[build-status-href]: https://travis-ci.org/scott113341/ensure-https-www/branches

[dependencies-badge]: https://img.shields.io/david/scott113341/ensure-https-www/master.svg?style=flat-square
[dependencies-href]: https://david-dm.org/scott113341/ensure-https-www/master#info=dependencies

[dev-dependencies-badge]: https://img.shields.io/david/dev/scott113341/ensure-https-www/master.svg?style=flat-square
[dev-dependencies-href]: https://david-dm.org/scott113341/ensure-https-www/master#info=devDependencies
