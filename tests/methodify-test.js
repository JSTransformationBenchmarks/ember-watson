'use strict';

const fs_readFilePromise = require('util').promisify(require('fs').readFile);

var Watson = require('../index.js');

var fs = require('fs');

var astEquality = require('./helpers/ast-equality');

describe('convert methods to ES6 syntax', function () {
  var baseDir = './tests/fixtures/methodify';
  var watson;
  beforeEach(function () {
    watson = new Watson();
  });
  it('converts to ES6 method syntax', async function () {
    var source = await fs_readFilePromise(baseDir + '/object-old.js');

    var newSource = watson._transformMethodify(source);

    var expectedNewSource = await fs_readFilePromise(baseDir + '/object-new.js');
    astEquality(newSource, expectedNewSource);
  });
  it('converts to ES6 method syntax and ignores object destructuring', async function () {
    var source = await fs_readFilePromise(baseDir + '/destructuring-old.js');

    var newSource = watson._transformMethodify(source);

    var expectedNewSource = await fs_readFilePromise(baseDir + '/destructuring-new.js');
    astEquality(newSource, expectedNewSource);
  });
});