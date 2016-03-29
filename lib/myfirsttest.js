/* global casper, serverlib, lib */
var map = require('map');
var lib = require('../lib');
casper.test.begin('Testing...', 0, function suite(test) {
  casper.login(serverConf.CRED, map.pages.myPage.urlString, function() {
    //casper.testElements(map.elements);
    //casper.test.assertTextExist(map.pages.myPage.title, "title");
    //casper.testElements(map.pages.myPage.elements);
    //casper.testElements(map.pages.myPage.buttons);
    //casper.testElements(map.pages.myPage.labels);
    //casper.testElementNotVisible(map.pages.myPage.conditional['FIRST_CONDITION']);
  });
  casper.then(function() {
    casper.test.assert(true, 'My fisrt test, do nothing');
    /*
      casper.fill(
          map.pages.myPage.form,
          map.pages.myPage.formData,
          true);
          */
  });
  casper.then(function() {
    //casper.waitUntilElementVisible(map.pages.myPage.conditional['FIRST_CONDITION']);
  });
  casper.run(function() {
    test.done();
  });
});
