/* global casper, require */
casper.options.pageSettings.loadImages = false;
casper.options.pageSettings.loadPlugins = false;
casper.options.pageSettings.localToRemoteUrlAccessEnabled = false;
casper.options.pageSettings.webSecurityEnabled = false;
casper.options.retryTimeout = 200;
casper.options.viewportSize = {
  width: 1000,
  height: 3009
};
casper.options.waitTimeout = 50000;

var x = require('casper').selectXPath;
var serverConf = require('../serverConf.js');
var aux = require('../lib');
