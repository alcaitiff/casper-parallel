#!/usr/bin/env node

var colors = require('colors/safe');
var moment = require('moment');
var mkdirp = require('mkdirp');
//var sleep = require('sleep');
var cp = require('child_process');
var fs = require('fs');
var charm = require('charm')();
var ProgressBar = require('progress');
//Mapping/Data File. This file will be ignored in all folders
var conf = "map.js";
//Starting At
var begin = moment();
//Node pars
//var nodePars = ['test', '--includes=conf.js', '--verbose', '--log-level=debug', '--post=logout.js'];
var nodePars = [
  'test',
  '--includes=conf.js',
  '--verbose',
  '--log-level=debug',
  '--ignore-ssl-errors=true',
  '--ssl-protocol=any'
];
//Debug Level
var logSuccess = true;
//Delay wait
var delay = 900;
var lines = {};
//Setup theme
setTheme(colors, lines);
var p = new Printer(charm);
startIt(colors, begin);
var files = getFiles(conf);
var totalScripts = files.length;
var pbar = new ProgressBar(':current/:total [:bar] :percent', {
  complete: '=',
  incomplete: ' ',
  width: 50,
  total: totalScripts
});
var servers, serverPool;
var scriptsDone = 0;
var scriptsFailed = 0;
var failed = 0,
  totalTests = 0,
  passed = 0;
if (files.length === 0) {
  p.printLine(lines.scripts, colors.error("No scripts found\n"));
} else {
  p.printLine(lines.bar, '');
  pbar.tick(0);
  p.printLine(lines.scripts, "Total scripts found:" + colors.scripts(files.length));
  setTimeout(bar, delay);
  serverPool = run(files, delay);
  servers = serverPool.length;
  p.printLine(lines.servers, "Servers Running:" + colors.total(servers));
}

//=================
//    Functions
//=================
function getFiles(conf) {
  var files = [];
  process.argv.forEach(function(val, index) {
    if (index > 1) {
      mkdirp('/tmp/' + val);
      var dfiles = fs.readdirSync(val);
      dfiles.forEach(function(name) {
        if (name !== conf && name.substr(name.length - 3, 3) === '.js') {
          files.push(val + '/' + name);
        }
      });
    }
  });
  return files;
}

function setTheme(obj, lines) {
  obj.setTheme({
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    url: 'grey',
    time: ['yellow', 'bold'],
    scripts: ['blue', 'bold'],
    error: 'red',
    passed: ['cyan', 'bold'],
    total: ['green', 'bold']
  });
  lines.title = 1;
  lines.scripts = 3;
  lines.servers = 9;
  lines.bar = 5;
  lines.time = 6;
  lines.result = 7;
  lines.errors = 15;
  lines.end = 30;
}

function startIt(colors, begin) {
  //Clear teminal
  charm.pipe(process.stdout);
  charm.reset();
  charm.cursor(false);
  //Print the reader
  p.printLine(lines.title, colors.info("Casper Suit v2") + '\t' + begin.format(
    'DD/MM/YYYY HH:mm:ss'));
}

function endIt() {
  servers--;
  bar();
  if (servers === 0) {
    p.end();
    charm.cursor(true);
    process.exit();
  }
}

function bar() {
  p.printLine(lines.servers, "Servers Running:" + colors.total(servers) + "\n");
  serverPool.forEach(function(server, index) {
    p.printLine(lines.servers + 1 + index, server.state());
  });
  var end = moment();
  p.printLine(lines.time, "Time:" + '\t' + colors.time(end.subtract(begin).format(
    'mm:ss')));
  p.printLine(lines.result, 'Failed:' + colors.error(failed) + ' Passed:' +
    colors.passed(passed) + ' Total:' + colors.total(totalTests) + '\n');
  if (totalScripts > 0) {
    //var perc = Math.round(scriptsDone * 100 / totalScripts);
    if (totalScripts > scriptsDone) {
      setTimeout(bar, delay);
    }
  }

}

function retrieveServerPool(delay) {
  var serverConf = require('./serverConf.js');
  var serverPool = [];
  serverConf.SERVER_POOL.forEach(function(val) {
    serverPool.push(new Server(val, delay));
  });
  return serverPool;
}

function run(files, delay) {
  var serverPool = retrieveServerPool(delay);
  serverPool.forEach(function(server) {
    server.run(files);
  });
  return serverPool;
}

function printFailure(file, log) {
  if (scriptsFailed === 0) {
    p.printLine(lines.errors, 'Failures:');
  }
  scriptsFailed++;
  var logfile = saveLog(file, log);
  p.printLine(lines.errors + scriptsFailed, 'Log: ' + colors.error(logfile));
}

function saveLog(file, log) {
  var logfile = '/tmp/' + file + '.log';
  fs.writeFile(logfile, log.join(''));
  return logfile;
}

function pad(width, msg, padding) {
  var str = String(msg);
  return (width <= str.length) ? str : pad(width, padding + str, padding);
}
//=================
//    Server
//=================
function Server(data, delay) {
  this.capacity = data.CAPACITY;
  this.curr = 0;
  this.doneScripts = 0;
  this.address = data.URL;
  this.wait = delay;
  this.emptyList = false;
  this.state = function() {
    return colors.data(pad(2, this.curr, 0) + '/' + pad(2, this.capacity, 0)) +
      colors.data(' \t Done:') + colors.scripts(
        pad(6, this.doneScripts, ' ')) + ' \t ' + colors.url(this.address);
  };
  this.run = function(files, delay) {
    if (typeof delay === "undefined") {
      delay = 0;
    }
    setTimeout(this.work.bind(this), delay, files);
  };
  this.work = function(files) {
    if (files.length) {
      if (this.curr >= this.capacity) {
        this.run(files, this.wait);
      } else {
        var file = files.pop();
        this.curr++;
        setTimeout(this.test.bind(this), 100, file);
        this.run(files);
      }
    } else {
      this.emptyList = true;
    }
  };
  this.exit = function(result, file, log) {
    this.curr--;
    if (result.failed) {
      printFailure(file, log);
    } else if (logSuccess) {
      saveLog(file, log);
    }
    failed += result.failed;
    passed += result.passed;
    totalTests += result.failed + result.passed;
    p.printLine(lines.bar, '');
    pbar.tick();
    if (this.curr === 0 && this.emptyList) {
      setTimeout(endIt, 100);
    }
  };
  this.test = function(file) {
    var pars = nodePars.slice(0);
    pars.push(file);
    pars.push('--cookies-file=/tmp/' + file + '.cookies.txt');
    pars.push('--serverAddress=' + this.address);
    var child = cp.spawn('casperjs', pars);
    child.server = this;
    child.stdout.log = [];
    child.file = file;
    child.on('exit', function() {
      var result = new Result(this.stdout.log);
      this.server.exit(result, file, this.stdout.log);
      this.server.doneScripts++;
      scriptsDone++;
    });
    child.stdout.on('data', function(buf) {
      this.log.push(String(buf));
    });
  };
}
//=================
//    Result
//=================
function Result(data) {
  var line = null;
  for (var i = data.length - 1; i > 0; i--) {
    line = data[i].split(',');
    if (line[4]) {
      break;
    }
  }
  this.passed = (line[1]) ? Number(line[1].split(' ')[1]) : 0;
  this.failed = (line[2]) ? Number(line[2].split(' ')[1]) : 1;
}
//=================
//    Printer
//=================
function Printer(charm) {
  this.charm = charm;
  this.printLine = function(line, text) {
    if (line >= 0) {
      this.charm.position(0, line);
    }
    this.charm.erase('line');
    this.charm.write(text);
  };
  this.end = function() {
    this.charm.position(0, lines.end);
  };
}
