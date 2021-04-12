'use strict';

const fs_readFilePromise = require('util').promisify(require('fs').readFile);

var Watson = require('../index.js');

var fs = require('fs');

var astEquality = require('./helpers/ast-equality');

describe('Resource router mapping', function () {
  var baseDir = './tests/fixtures/resource-router-mapping';
  var watson;
  beforeEach(function () {
    watson = new Watson();
  });
  describe('convert resource to route with resetNamespace option', function () {
    it('transform simple resource', async function () {
      var source = await fs_readFilePromise(baseDir + '/old-foos-route.js');

      var newSource = watson._transformResourceRouterMapping(source);

      var expectedNewSource = await fs_readFilePromise(baseDir + '/new-foos-route.js');
      astEquality(newSource, expectedNewSource);
    });
    it('transform nested resources', async function () {
      var source = await fs_readFilePromise(baseDir + '/old-foos-bar-route.js');

      var newSource = watson._transformResourceRouterMapping(source);

      var expectedNewSource = await fs_readFilePromise(baseDir + '/new-foos-bar-route.js');
      astEquality(newSource, expectedNewSource);
    });
    it('transform ember-cli file format', async function () {
      var source = await fs_readFilePromise(baseDir + '/old-ember-cli-sample.js');

      var newSource = watson._transformResourceRouterMapping(source);

      var expectedNewSource = await fs_readFilePromise(baseDir + '/new-ember-cli-sample.js');
      astEquality(newSource, expectedNewSource);
    });
    it('transform complex ember-cli file format', async function () {
      var source = await fs_readFilePromise(baseDir + '/old-complex-ember-cli-sample.js');

      var newSource = watson._transformResourceRouterMapping(source);

      var expectedNewSource = await fs_readFilePromise(baseDir + '/new-complex-ember-cli-sample.js');
      astEquality(newSource, expectedNewSource);
    });
    it('transform conditional routing in ember-cli file format', async function () {
      var source = await fs_readFilePromise(baseDir + '/old-ember-cli-conditional-sample.js');

      var newSource = watson._transformResourceRouterMapping(source);

      var expectedNewSource = await fs_readFilePromise(baseDir + '/new-ember-cli-conditional-sample.js');
      astEquality(newSource, expectedNewSource);
    });
  });
});