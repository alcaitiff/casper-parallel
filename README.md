casper-suit
==========

Run it or import it and call createProject();

Ex:

$ node casper-parallel/generate.js

This code will create a directory called casper-suit for your tests. Inside it will put some basic files like a casper script to save screenshots, a casper configuration file, a server configuration file for multiple servers, a lib with some helpful functions and a node script called run.js.

The run.js file need a list of directories as parameter and will start a group of tests inside this directories in parallel using subproccess.

Ex:
$ ./run.js MyFirstTestCase
or
$ ./run.js testDir1 testDir2
or
$ ./run.js testDir*

This will create a folder for each test directory in your tmp, and will put all logs there.

To run a single test you can use the line:
$ casperjs test --cookies-file=/tmp/mycookies.txt testFolder/testname.js --includes=conf.js  --verbose --log-level=debug --post=screenshot.js

This will run your test in debug mode and save an image with your's test last screen.

Tips
====

 - To keep organization put all your data in the map.js file, never write any xpath or css selector in your test file.
 - Never write any "if" in your test file
 - If you have two cases in your test, write two tests
 - Never write a test with logic, put your logic in the lib.js
 - Try to keep your tests using a single line using casper.testElement() or casper.testElements()
 - Write more and smaller tests. They will run in parallel and this will be better and faster.
