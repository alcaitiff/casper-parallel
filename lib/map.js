/* global module, casper, serverConf,lib */
lib = require("../lib");
module.exports = {
  elements: {
    /*
    0: {
      selector: x("//"),
      name: ""
    }
    */
  },
  pages: {
    myPage: {
      urlString: serverConf.SERVER_ADDRESS,
      title: "myTitle",
      form: "#myform",
      labels: {}
      /*
      lib.Elements(x(""),
        "Label", {
          0: "FirstLabel",
          1: "SecondLabel"
        })*/
      ,
      buttons: {}
      /*
      lib.Elements(x(""),
        "Button", {
          0: "MyButton"
        })
        */
      ,
      elements: {},
      conditional: {
        /*
        "FIRST_CONDITION": {
          selector: "",
          name: "MyCondition"
        }
        */
      }
    }

  }
};
