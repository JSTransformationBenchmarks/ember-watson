"use strict";

const fs_readFilePromise = require('util').promisify(require('fs').readFile);

var Watson = require('../index.js');

var fs = require('fs');

var astEquality = require('./helpers/ast-equality');

var recast = require('recast');

describe('ember data isNewSerializerAPI', function () {
  var baseDir = './tests/fixtures/remove-ember-data-is-new-serializer-api';
  var watson;
  beforeEach(function () {
    watson = new Watson();
  });
  describe('removing isNewSerializerAPI literals', function () {
    it('removes the isNewSerializerAPI directive', async function () {
      var source = await fs_readFilePromise(baseDir + '/old/serializer.js');

      var newSource = watson._removeEmberDataIsNewSerializerAPI(source);

      var expectedNewSource = await fs_readFilePromise(baseDir + '/new/serializer.js');
      astEquality(newSource, expectedNewSource);
    });
  });
});