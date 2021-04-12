const fs_readFilePromise = require('util').promisify(require('fs').readFile);

var Watson = require('../index.js');

var fs = require('fs');

var astEquality = require('./helpers/ast-equality');

describe('replacing deprecated needs with controller injection', function () {
  it('replaces single needs', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/replace-needs-with-injection/single.js');
    var watson = new Watson();

    var newSource = watson._replaceNeedsWithInjection(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/replace-needs-with-injection/single-result.js'));
  });
  it('replaces needs arrays', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/replace-needs-with-injection/array.js');
    var watson = new Watson();

    var newSource = watson._replaceNeedsWithInjection(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/replace-needs-with-injection/array-result.js'));
  });
  it('dedupes controller names', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/replace-needs-with-injection/array.js');
    var watson = new Watson();

    var newSource = watson._replaceNeedsWithInjection(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/replace-needs-with-injection/array-result.js'));
  });
  it('replaces uses', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/replace-needs-with-injection/uses.js');
    var watson = new Watson();

    var newSource = watson._replaceNeedsWithInjection(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/replace-needs-with-injection/uses-result.js'));
  });
  it('adds an import if needed', async function () {
    var source = await fs_readFilePromise('./tests/fixtures/replace-needs-with-injection/no-ember-import.js');
    var watson = new Watson();

    var newSource = watson._replaceNeedsWithInjection(source);

    astEquality(newSource, await fs_readFilePromise('./tests/fixtures/replace-needs-with-injection/no-ember-import-result.js'));
  });
});