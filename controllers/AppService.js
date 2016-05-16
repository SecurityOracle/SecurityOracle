'use strict';

var Promise = require("bluebird");

var check = Promise.promisify(require('nsp/lib/check'));
var processDeps = require('../utils/processDeps');
var uuid = require('uuid');

var db = require('../utils/db');

exports.appPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * application (Application)
  **/
  
  res.setHeader('Content-Type', 'application/json');
  
  var examples = {};
  examples['application/json'] = {
  "vulnerable" : true,
  "reportId" : "aeiou"
};

  var reportId = uuid.v4();

  var app = args.application.value;
  
  if (app.dependencies) {
      app.dependencies = processDeps(app.dependencies);
  }
  
  check({
      shrinkwrap: app,
      offline: true,
      advisoriesPath: './advisories.json'
  }).then(function(vulnerabilites) {
      var result = {
          vulnerable: vulnerabilites.length > 0,
          reportId: reportId
      }
      
      res.write(JSON.stringify(result));
      
      var doc = {
          appId: app.appId,
          name: app.name,
          version: app.version,
          uris: app.uris,
          vulnerabilites: vulnerabilites
      };
      
      return db.putAsync(reportId, doc);
  }).then(function(doc) {
      res.end();
  }, function(error) {
      //console.error(error.message);
      //console.error(error.stack);
      res.end(error.stack);
  });
}

