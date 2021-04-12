'use strict';

const fs_readFilePromise = require('util').promisify(require('fs').readFile);

var Watson = require('../index.js');

var fs = require('fs');

var astEquality = require('./helpers/ast-equality');

describe('ember data async false relationships', function () {
  var baseDir = './tests/fixtures/ember-data-async-false-relationships';
  var watson;
  beforeEach(function () {
    watson = new Watson();
  });
  describe('hasMany relationship macro', function () {
    it('adds explicit async: false to options', async function () {
      var source = await fs_readFilePromise(baseDir + '/has-many-old.js');

      var newSource = watson._transformEmberDataAsyncFalseRelationships(source);

      var expectedNewSource = await fs_readFilePromise(baseDir + '/has-many-new.js');
      astEquality(newSource, expectedNewSource);
    });
  });
  describe('belongsTo relationship macro', function () {
    it('adds explicit async: false to options', async function () {
      var source = await fs_readFilePromise(baseDir + '/belongs-to-old.js');

      var newSource = watson._transformEmberDataAsyncFalseRelationships(source);

      var expectedNewSource = await fs_readFilePromise(baseDir + '/belongs-to-new.js');
      astEquality(newSource, expectedNewSource);
    });
  });
});