const fs_readFilePromise = require('util').promisify(require('fs').readFile);

var Watson = require('../index.js');

var fs = require('fs');

var astEquality = require('./helpers/ast-equality');

var recast = require('recast');

describe('convert acceptance tests to use destroy-app helper', function () {
  it('makes the correct transformations - qunit', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/destroy-app-transform/old-default-qunit.js');
    var watson = new Watson();

    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/destroy-app-transform/new-default-qunit.js'));
  });
  it('makes the correct transformations - mocha', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/destroy-app-transform/old-default-mocha.js');
    var watson = new Watson();

    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/destroy-app-transform/new-default-mocha.js'));
  });
  it('does not remove ember import if otherwise used in test - qunit', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/destroy-app-transform/old-with-ember-usage-qunit.js');
    var watson = new Watson();

    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/destroy-app-transform/new-with-ember-usage-qunit.js'));
  });
  it('does not remove ember import if otherwise used in test - mocha', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/destroy-app-transform/old-with-ember-usage-mocha.js');
    var watson = new Watson();

    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/destroy-app-transform/new-with-ember-usage-mocha.js'));
  });
  it('can handle a non-standard application name - qunit', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/destroy-app-transform/old-crazy-app-name-qunit.js');
    var watson = new Watson();

    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/destroy-app-transform/new-crazy-app-name-qunit.js'));
  });
  it('can handle a non-standard application name - mocha', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/destroy-app-transform/old-crazy-app-name-mocha.js');
    var watson = new Watson();

    var newSource = watson._transformDestroyApp(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/destroy-app-transform/new-crazy-app-name-mocha.js'));
  });
});