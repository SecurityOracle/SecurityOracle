'use strict';

var Promise = require("bluebird");

var check = Promise.promisify(require('nsp/lib/check'));
var processDeps = require('../utils/processDeps');
var tmp = Promise.promisifyAll(require('tmp'));

exports.appPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * application (Application)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "vulnerable" : true,
  "report_id" : "aeiou"
};

  var app = args.application;
  
  if (app.dependencies) {
      app.dependencies = processDeps(app.dependencies);
  }
  
  check({
      shrinkwrap: app,
      offline: true,
      advisoriesPath: './advisories.json'
  }).then(function(result) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
  }, function(error) {
      //console.error(error.message);
      //console.error(error.stack);
      res.end(error.stack);
  });
  
  // if(Object.keys(examples).length > 0) {
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
//   }
//   else {
//     res.end();
//   }
}

