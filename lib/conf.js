/* global casper, require,x,serverConf,lib,serverIndex,serverAddress */
casper.options.pageSettings.loadImages = false;
casper.options.pageSettings.loadPlugins = false;
casper.options.pageSettings.localToRemoteUrlAccessEnabled = false;
casper.options.pageSettings.webSecurityEnabled = false;
casper.options.retryTimeout = 300;
casper.options.viewportSize = {
  width: 1000,
  height: 1000
};
casper.options.waitTimeout = 30000;

x = require("casper").selectXPath;
serverConf = require("../serverConf.js");
lib = require("../lib");
serverIndex = casper.cli.raw.get("serverIndex");
serverAddress = casper.cli.raw.get("serverAddress");
if (!serverIndex) {
  serverIndex = 0;
}
if (serverIndex >= serverConf.SERVER_POOL.length) {
  serverIndex = serverIndex % serverConf.SERVER_POOL.length;
}
serverConf.SERVER_ADDRESS = serverConf.SERVER_POOL[serverIndex].URL;
if (serverAddress) {
  serverConf.SERVER_ADDRESS = serverAddress;
}
console.log(serverConf.SERVER_ADDRESS);
