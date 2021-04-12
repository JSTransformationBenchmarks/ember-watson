const fs_writeFilePromise = require('util').promisify(require('fs').writeFile);

const fs_readFilePromise = require('util').promisify(require('fs').readFile);

var chalk = require('chalk');

var fs = require('fs');

var existsSync = require('exists-sync');

var EOL = require('os').EOL;

var findFiles = require('./helpers/find-files');

var qunitTransforms = require('./formulas/qunit-transforms');

var prototypeExtensionTransforms = require('./formulas/prototype-extension-transforms');

var transformEmberDataModelLookups = require('./formulas/ember-data-model-lookup-transform');

var transformEmberDataAsyncFalseRelationships = require('./formulas/ember-data-async-false-relationships-transforms');

var transformResourceRouterMapping = require('./formulas/resource-router-mapping');

var transformMethodify = require('./formulas/methodify');

var FindOverloadedCPs = require('./formulas/find-overloaded-cps');

var transformDestroyApp = require('./formulas/destroy-app-transform');

var removeEmberK = require('./formulas/remove-ember-k');

var replaceNeedsWithInjection = require('./formulas/replace-needs-with-injection');

var removeEmberDataIsNewSerializerAPI = require('./formulas/remove-ember-data-is-new-serializer-api');

var transformTestsToAsyncAwait = require('./formulas/convert-tests-to-async-await');

module.exports = EmberWatson;

function EmberWatson() {}

EmberWatson.prototype._removeEmberDataIsNewSerializerAPI = removeEmberDataIsNewSerializerAPI;

EmberWatson.prototype.removeEmberDataIsNewSerializerAPI = async function (path, dryRun) {
  var files = await findFiles(path, '.js');
  transform(files, this._removeEmberDataIsNewSerializerAPI, dryRun);
};

EmberWatson.prototype._transformEmberDataAsyncFalseRelationships = transformEmberDataAsyncFalseRelationships;

EmberWatson.prototype.transformEmberDataAsyncFalseRelationships = async function (rootPath, dryRun) {
  var files = await findFiles(rootPath, '.js');
  transform(files, this._transformEmberDataAsyncFalseRelationships, dryRun);
};

EmberWatson.prototype._transformEmberDataModelLookups = transformEmberDataModelLookups;

EmberWatson.prototype.transformEmberDataModelLookups = async function (rootPath, dryRun) {
  var files = await findFiles(rootPath, '.js');
  transform(files, this._transformEmberDataModelLookups, dryRun);
};

EmberWatson.prototype._transformQUnitTest = qunitTransforms;

EmberWatson.prototype.transformQUnitTest = async function (rootPath, dryRun) {
  var tests = (await findFiles(rootPath, '.js')).filter(function (file) {
    return file.indexOf('-test.js') > 0;
  });
  transform(tests, this._transformQUnitTest, dryRun);
};

EmberWatson.prototype._transformPrototypeExtensions = prototypeExtensionTransforms;

EmberWatson.prototype.transformPrototypeExtensions = async function (rootPath, dryRun) {
  var files = await findFiles(rootPath, '.js');
  transform(files, this._transformPrototypeExtensions, dryRun);
};

EmberWatson.prototype._transformMethodify = transformMethodify;

EmberWatson.prototype.transformMethodify = async function (rootPath, dryRun) {
  var files = await findFiles(rootPath, '.js');
  transform(files, this._transformMethodify, dryRun);
};

EmberWatson.prototype._transformResourceRouterMapping = transformResourceRouterMapping;

EmberWatson.prototype.transformResourceRouterMapping = function (routerPath, dryRun) {
  transform([routerPath], this._transformResourceRouterMapping, dryRun);
};

EmberWatson.prototype._transformDestroyApp = transformDestroyApp;
EmberWatson.prototype.removeEmberK = removeEmberK;

EmberWatson.prototype.replaceNeedsWithInjection = async function (path, dryRun) {
  var files = await findFiles(path, '.js');
  transform(files, this._replaceNeedsWithInjection, dryRun);
};

EmberWatson.prototype._replaceNeedsWithInjection = replaceNeedsWithInjection;

EmberWatson.prototype.transformTestToUseDestroyApp = async function (rootPath, dryRun) {
  if (!existsSync('tests/helpers/destroy-app.js') && !dryRun) {
    console.log(chalk.red('tests/helpers/destroy-app.js file is not present. ' + 'You must either manually place the file or upgrade to an ' + 'ember-cli version > 1.13.8.' + EOL + 'For more info, visit ' + 'https://gist.github.com/blimmer/35d3efbb64563029505a#create-your-own-destroy-app-helper'));
    return;
  }

  var tests = (await findFiles(rootPath, '.js')).filter(function (file) {
    return file.indexOf('-test.js') > 0;
  });
  transform(tests, this._transformDestroyApp, dryRun);
};

EmberWatson.prototype.findOverloadedCPs = async function (rootPath, dryRun) {
  var searcher = new FindOverloadedCPs();
  transform(await findFiles(rootPath, '.js'), function (source, filename) {
    searcher.examineSource(source, filename);
    return source;
  }, dryRun);
  return searcher;
};

EmberWatson.prototype._transformTestsToAsyncAwait = transformTestsToAsyncAwait;

EmberWatson.prototype.transformTestsToAsyncAwait = async function (rootPath, dryRun) {
  var tests = (await findFiles(rootPath, '.js')).filter(function (file) {
    return file.indexOf('-test.js') > 0;
  });
  transform(tests, this._transformTestsToAsyncAwait, dryRun);
};

function transform(files, transformFormula, dryRun) {
  var wontFix = [];

  for (const [arrayIteratorIndex, file] of files.entries()) {
    var source = await fs_readFilePromise(file);

    try {
      var newSource = transformFormula(source, file);

      if (source != newSource) {
        if (dryRun) {
          console.log({
            filename: file
          }, '\0');
        } else {
          console.log(chalk.green('Fixed: ', file));
          await fs_writeFilePromise(file, newSource);
        }
      }
    } catch (error) {
      wontFix.push({
        name: file,
        error: error.message
      });
    }
  }

  if (wontFix.length > 0 && !dryRun) {
    console.log(chalk.red('\n\nOh Dear! I wasn\'t able to save the following files:'));
    wontFix.forEach(function (file) {
      console.log(chalk.red(file.name + ' - ' + file.error));
    });
    console.log(chalk.red('\nA possible cause is having all the source code commented.'));
    console.log(chalk.red('If that\'s not the problem please fill a report with the hospital directors\nat https://github.com/abuiles/ember-watson/issues.\n\n'));
  }

  return true;
}