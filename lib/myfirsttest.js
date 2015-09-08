/* global casper, serverlib, lib */
var map = require('map');
var lib = require('../lib');
casper.test.begin('Testing...', 0, function suite(test) {
  casper.login(serverlib, map.pages.myPage.urlString, function() {
    //casper.testElements(lib.elements);
    //casper.test.assertTextExist(lib.pages.myPage.title, "title");
    //casper.testElements(lib.pages.myPage.elements);
    //casper.testElements(lib.pages.myPage.buttons);
    //casper.testElements(lib.pages.myPage.labels);
    //casper.testElementNotVisible(lib.pages.myPage.conditional['FIRST_CONDITION']);
  });
  casper.then(function() {
    /*
      casper.fill(
          lib.pages.myPage.form,
          lib.pages.myPage.formData,
          true);
          */
  });
  casper.then(function() {
    //casper.waitUntilElementVisible(lib.pages.myPage.conditional['FIRST_CONDITION']);
  });
  casper.run(function() {
    test.done();
  });
});
