/* global module */
/*exported dev,test,local,damor*/
var auth = {
  USER: "mylogin",
  PASSWORD: "mypassword"
};
var dev = {
  "URL": "https://www.npmjs.com/package/casper-parallel",
  "CAPACITY": 30 //Number of parallel process
};
var local = {
  "URL": "http://localhost",
  "CAPACITY": 1
};
var serverConf = {
  SERVER_POOL: [dev],
  //You can define how many servers as you like
  //  SERVER_POOL: [local,dev],

  //This is an example of get authentication for a rest api,
  //CRED: "?login=" + auth.USER + "&password=" + auth.PASSWORD

  //This is an example of authentication using a token
  //CRED: "?token=" + auth.TOKEN

  //Empty cred
  CRED: undefined
};
module.exports = serverConf;
