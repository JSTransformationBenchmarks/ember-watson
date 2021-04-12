const fs_readFilePromise = require('util').promisify(require('fs').readFile);

var Watson = require('../index.js');

var fs = require('fs');

var astEquality = require('./helpers/ast-equality');

var recast = require('recast');

describe('Qunit tests with ember-qunit', function () {
  it('makes the correct transformations', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/qunit-files/old-with-ember-qunit.js');
    var watson = new Watson();

    var newSource = watson._transformQUnitTest(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/qunit-files/new-with-ember-qunit.js'));
  });
});
describe('Qunit tests only with qunit', function () {
  it('makes the correct transformations when using QUnit.test', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/qunit-files/old-using-qunit-global.js');
    var watson = new Watson();

    var newSource = watson._transformQUnitTest(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/qunit-files/new-using-qunit-global.js'));
  });
  it('makes the correct transformations', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/qunit-files/old-with-qunit.js');
    var watson = new Watson();

    var newSource = watson._transformQUnitTest(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/qunit-files/new-with-qunit.js'));
  });
  it('add skip if used', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/qunit-files/old-with-qunit-and-skip.js');
    var watson = new Watson();

    var newSource = watson._transformQUnitTest(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/qunit-files/new-with-qunit-and-skip.js'));
  });
  it('does not change the file if it is correct', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/qunit-files/new-with-qunit.js');
    var watson = new Watson();

    var newSource = watson._transformQUnitTest(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/qunit-files/new-with-qunit.js'));
  });
  it('transforms `test` calls with arrow functions to pass `assert` as first argument', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/qunit-files/arrowfunction-old.js');
    var watson = new Watson();

    var newSource = watson._transformQUnitTest(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/qunit-files/arrowfunction-new.js'));
  });
});