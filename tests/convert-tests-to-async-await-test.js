'use strict';

const fs_readFilePromise = require('util').promisify(require('fs').readFile);

var Watson = require('../index.js');

var fs = require('fs');

var astEquality = require('./helpers/ast-equality');

describe('Mocha async transformation', function () {
  var baseDir = './tests/fixtures/convert-tests-to-async-await';
  var watson;
  beforeEach(function () {
    watson = new Watson();
  });
  it('transforms async acceptance test using `done()` callback', async function () {
    var source = await fs_readFilePromise(baseDir + '/old-acceptance-test-with-done.js');

    var newSource = watson._transformTestsToAsyncAwait(source);

    var expectedNewSource = await fs_readFilePromise(baseDir + '/new-acceptance-test-with-done.js');
    astEquality(newSource, expectedNewSource);
  });
  it('transforms async acceptance test without `done()`', async function () {
    var source = await fs_readFilePromise(baseDir + '/old-acceptance-test-without-done.js');

    var newSource = watson._transformTestsToAsyncAwait(source);

    var expectedNewSource = await fs_readFilePromise(baseDir + '/new-acceptance-test-without-done.js');
    astEquality(newSource, expectedNewSource);
  });
  it('transforms async acceptance test nested `andThen`s', async function () {
    var source = await fs_readFilePromise(baseDir + '/old-acceptance-test-with-nested-andthen.js');

    var newSource = watson._transformTestsToAsyncAwait(source);

    var expectedNewSource = await fs_readFilePromise(baseDir + '/new-acceptance-test-with-nested-andthen.js');
    astEquality(newSource, expectedNewSource);
  });
  it('leaves synchronous tests as-is', async function () {
    var source = await fs_readFilePromise(baseDir + '/acceptance-test-synchronous.js');

    var newSource = watson._transformTestsToAsyncAwait(source);

    var expectedNewSource = await fs_readFilePromise(baseDir + '/acceptance-test-synchronous.js');
    astEquality(newSource, expectedNewSource);
  });
  it('leaves `done` callback as-is when used outside of `andThen`', async function () {
    var source = await fs_readFilePromise(baseDir + '/old-acceptance-test-with-callback.js');

    var newSource = watson._transformTestsToAsyncAwait(source);

    var expectedNewSource = await fs_readFilePromise(baseDir + '/new-acceptance-test-with-callback.js');
    astEquality(newSource, expectedNewSource);
  });
  it('transforms async qunit test', async function () {
    var source = await fs_readFilePromise(baseDir + '/old-qunit.js');

    var newSource = watson._transformTestsToAsyncAwait(source);

    var expectedNewSource = await fs_readFilePromise(baseDir + '/new-qunit.js');
    astEquality(newSource, expectedNewSource);
  });
});