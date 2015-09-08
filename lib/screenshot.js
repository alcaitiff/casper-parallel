/* global casper, serverConf */

casper.test.begin('Saving image', 0, function suite(test) {
  casper.then(function() {
    this.capture('screen.png', {
      top: 0,
      left: 0,
      width: 1000,
      height: 1000
    });
  });
  casper.run(function() {
    test.done();
  });
});
