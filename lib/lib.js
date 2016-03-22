/* global module, casper */
//LIB FUNCTIONS
module.exports = {
  randomNumber: function(size) {
    min = 1;
    max = Math.pow(10, size - 1);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  randomString: function(length, nolatin) {
    if (nolatin === true) {
      vogals = 'aeiou';
      consonants = 'bcdfghjkllmmnnprrsstvxz';
    } else {
      vogals = 'aeiouaeiouaeiouaeiouàêióü';
      consonants = 'bcdfghjkllmmnnprrsstvxzç';
    }

    chars = [vogals, consonants];
    var result = '';
    var use = Math.round(Math.random() * 10) % 2;
    for (var i = length; i > 0; --i) {
      result += chars[use][Math.round(Math.random() * (chars[use].length - 1))];
      use = (use) ? 0 : 1;
    }
    return result;
  },
  testSugest: function(func) {
    casper.waitFor(this.isLoading, function() {
      casper.waitFor(this.isNotLoading, func);
    });
  },
  isLoading: function() {
    return casper.evaluate(this.loading);
  },
  isNotLoading: function() {
    return !casper.evaluate(this.loading);
  },
  loading: function() {
    return $("#name").hasClass("ui-autocomplete-loading");
  },
  Elements: function(s, n, a) {
    var r = {};
    for (var index = 0; index < a.size(); index++) {
      selector = this.replaceInSelector(s, a[index]);
      r[index] = {
        'selector': selector,
        'name': n + ' ' + a[index]
      };
    }
    return r;
  },
  isXpath: function(s) {
    return (typeof s.path !== "undefined") ? true : false;
  },
  replaceInSelector: function(s, v) {
    stringSelector = (this.isXpath(s)) ? s.path : s;
    newStringSelector = stringSelector.split('%s').join(v);
    if (this.isXpath(s)) {
      return {
        type: 'xpath',
        path: newStringSelector
      };
    } else {
      return newStringSelector;
    }
  },
  concatInSelector: function(s, v) {
    stringSelector = (this.isXpath(s)) ? s.path : s;
    newStringSelector = stringSelector + v;
    if (this.isXpath(s)) {
      return {
        type: 'xpath',
        path: newStringSelector
      };
    } else {
      return newStringSelector;
    }
  },
  Element: function(s, n) {
    this.selector = s;
    this.name = n;
    return this;
  },
  Column: function(s) {
    this.s = s;
    this.name = 'Col';
    this.element = function(v) {
      return {
        'selector': this.replaceInSelector(s, v),
        'name': this.name + ' ' + v
      };
    };
    this.asc = function(v) {
      return {
        'selector': this.concatInSelector(this.replaceInSelector(s, v), '[@class=\'order\']'),
        'name': this.name + ' ASC ' + v
      };
    };
    this.dsc = function(v) {
      return {
        'selector': this.concatInSelector(this.replaceInSelector(s, v), '[@class=\'inverseOrder\']'),
        'name': this.name + ' DSC ' + v
      };
    }
    return this;
  }
};
Object.prototype.size = function() {
  var size = 0,
    key;
  for (key in this) {
    if (this.hasOwnProperty(key))
      size++;
  }
  return size;
};
casper.waitAndTestSelector = function(selector, text, func) {
  casper.waitForSelector(selector,
    function() {
      casper.test.assertExist(selector, text);
      if (typeof func !== "undefined") {
        func();
      }
    },
    function() {
      casper.test.assertExist(selector, text);
    });
};
casper.testElement = function(element, func) {
  casper.test.assertExist(element["selector"], element["name"]);
  if (typeof func !== "undefined") {
    func();
  }
};
casper.testElementVisible = function(element) {
  casper.test.assertVisible(element["selector"], element["name"]);
};
casper.testElementNotVisible = function(element) {
  casper.test.assertNotVisible(element["selector"], element["name"]);
};
casper.waitUntilElementVisible = function(element, func) {
  casper.waitUntilVisible(element["selector"],
    function() {
      casper.test.assertVisible(element["selector"], element["name"]);
      if (typeof func !== "undefined") {
        func();
      }
    },
    function() {
      casper.test.assertVisible(element["selector"], element["name"]);
    });
};
casper.waitWhileElementVisible = function(element, func) {
  casper.waitWhileVisible(element["selector"],
    function() {
      casper.test.assertNotVisible(element["selector"], element["name"]);
      if (typeof func !== "undefined") {
        func();
      }
    },
    function() {
      casper.test.assertNotVisible(element["selector"], element["name"]);
    });
};
casper.clickElement = function(element) {
  casper.test.assertExist(element["selector"], element["name"]);
  casper.click(element["selector"]);
};
casper.waitAndClickElement = function(element) {
  casper.waitAndTestElement(element, function() {
    casper.click(element["selector"]);
  });
};
casper.waitAndClickSelector = function(selector) {
  casper.waitAndTestSelector(selector, function() {
    casper.click(selector);
  });
};
casper.testElements = function(elements) {
  for (var index = 0; index < elements.size(); index++) {
    casper.testElement(elements[index]);
  }
};
casper.testNotElement = function(element, func) {
  casper.test.assertDoesntExist(element["selector"], element["name"]);
  if (typeof func !== "undefined") {
    func();
  }
};
casper.testNotElements = function(elements) {
  for (var index = 0; index < elements.size(); index++) {
    casper.testNotElement(elements[index]);
  }
};

casper.waitAndTestElement = function(element, func) {
  casper.waitAndTestSelector(element["selector"], element["name"], func);
};
casper.waitAndTestElements = function(elements) {
  for (var index = 0; index < elements.size(); index++) {
    casper.waitAndTestElement(elements[index]);
  }

};
casper.testOrder = function(col, i) {
  var sel = col.element(i).selector;
  casper.then(function() {
    casper.click(sel);
  });
  casper.then(function() {
    casper.testElement(col.asc(i));
  });
  casper.then(function() {
    //Clica na mesma coluna para ordenar descendente
    casper.click(sel);
  });
  casper.then(function() {
    //Testa se esta ordenado pela coluna descendente
    casper.testElement(col.dsc(i));
  });
};

casper.fillAutoCompletion = function(element, text, index) {
  this.click(element.selector);
  //keepfocus : true to keep the auto-completion opened
  this.sendKeys(element.selector, text, {
    keepFocus: true
  });
  //wait for the auto-complete block to appear
  this.waitUntilVisible("[class*='ui-front']", function() {
    for (var i = 0; i < index; i++) {
      this.sendKeys(element.selector, casper.page.event.key.Down, {
        keepFocus: true
      });
    }
  });
  this.then(function() {
    this.sendKeys(element.selector, casper.page.event.key.Enter);
  });
};

casper.selectElementIndex = function(element, index) {
  this.click(element.selector);
  for (var i = 0; i < index; i++) {
    this.sendKeys(element.selector, casper.page.event.key.Down, {
      keepFocus: true
    });
  }
  this.then(function() {
    this.sendKeys(element.selector, casper.page.event.key.Enter);
  });
};

casper.login = function(cred, url, func) {
  return casper.start(url + cred, func);
};

casper.getElementText = function(element) {
  return this.fetchText(element.selector);
};
