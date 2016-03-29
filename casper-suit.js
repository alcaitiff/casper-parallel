#!/usr/bin/env node

var colors = require('colors');
var fs = require('fs-tools');
var mkdirp = require('mkdirp');
var testCaseName = 'MyFirstTestCase';
var path = require('path');
var lib = path.resolve(__dirname, 'lib');
var modules = path.resolve(__dirname, 'node_modules');
var ncp = require('ncp').ncp;

console.log('Installing casper-suit'.blue.bold);
createDir();

function createDir() {
  console.log('Creating the suit directory');
  mkdirp('casper-suit',
    function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log('Directory created'.green);
        createFiles();
      }
    }
  );
}

function createFiles() {
  console.log('Creating files');
  createRunner();
  createServerConf();
  createFunctions();
  createTestCase();
  copyModules();
}

function copyModules() {
  console.log('Creating Modules');
  ncp(modules, 'casper-suit/node_modules',
    function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log('Modules created'.green);
      }
    }
  );
}

function createRunner() {
  console.log('Creating the runner');
  fs.copy(lib + '/run.js', 'casper-suit/run.js',
    function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log('Runner created'.green);
      }
    }
  );
}

function createServerConf() {
  console.log('Creating the server configuration file');
  fs.copy(lib + '/serverConf.js', 'casper-suit/serverConf.js',
    function() {
      console.log('Server configuration file created'.green);
    }
  );
}

function createFunctions() {
  console.log('Creating the functions files');
  fs.copy(lib + '/screenshot.js', 'casper-suit/screenshot.js',
    function() {
      console.log('Screenshot file created'.green);
    }
  );
  fs.copy(lib + '/lib.js', 'casper-suit/lib.js',
    function() {
      console.log('Lib file created'.green);
    }
  );
  fs.copy(lib + '/conf.js', 'casper-suit/conf.js',
    function() {
      console.log('Casper configuration file created'.green);
    }
  );
}

function createTestCase() {
  console.log('Creating first test case');
  mkdirp('casper-suit/' + testCaseName,
    function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log(('Directory ' + testCaseName + ' created').green);
        createTestCaseFiles();
      }
    }
  );
}

function createTestCaseFiles() {
  fs.copy(lib + '/map.js', 'casper-suit/' + testCaseName + '/map.js',
    function() {
      console.log('Map file created'.green);
    }
  );
  fs.copy(lib + '/myfirsttestfail.js', 'casper-suit/' + testCaseName +
    '/myfirsttestfail.js',
    function() {
      console.log('Test fail file created'.green);
    }
  );
  fs.copy(lib + '/myfirsttest.js', 'casper-suit/' + testCaseName +
    '/myfirsttest.js',
    function() {
      console.log('Test file created'.green);
    }
  );
}
exports.createProject = function() {
  //console.log(lib);
  //For test purposes
  createDir();
};
