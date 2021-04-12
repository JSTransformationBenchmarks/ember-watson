'use strict';

const fs_readFilePromise = require('util').promisify(require('fs').readFile);

var Watson = require('../index.js');

var fs = require('fs');

var chai = require('chai');

describe('find overloaded CPs', function () {
  var baseDir = './tests/fixtures/find-overloaded-cps';
  var watson;
  beforeEach(function () {
    watson = new Watson();
  });
  it('has expected JSON output', async function () {
    var searcher = await watson.findOverloadedCPs(baseDir + '/input');
    var expectedReport = JSON.parse(await fs_readFilePromise(baseDir + '/output/report.json'));
    chai.expect(searcher.findings).to.deep.equal(expectedReport);
  });
});