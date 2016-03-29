/* global casper, serverlib, lib,map,serverConf */
map = require("map");
lib = require("../lib");
casper.test.begin("Testing...", 0, function suite(test) {
  casper.login(serverConf.CRED, map.pages.myPage.urlString, function() {});
  casper.then(function() {
    casper.test.assert(false,
      "My fisrt FAIL, just fix me and everything will be ok");
  });
  casper.run(function() {
    test.done();
  });
});
