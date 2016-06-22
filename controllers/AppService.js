'use strict';

var Promise = require("bluebird");

var check = Promise.promisify(require('nsp/lib/check'));
var processDeps = require('../utils/processDeps');
var findSolutions = require('../utils/findSolutions');
var uuid = require('uuid');

var db = require('../utils/db');

function getReports(appKey) {
  return db.getAsync(appKey).catch(function(err) {
      return err.notFound;
  }, function() {
      return [];
  });
}

exports.appPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * application (Application)
  **/
  
  res.setHeader('Content-Type', 'application/json');

  var reportId = uuid.v4();
  var app = args.application.value;
  
  var reportKey = "report_" + reportId;
  var appKey = "app_" + app.appId;
  
  if (app.dependencies) {
      app.dependencies = processDeps(app.dependencies);
  }
  
  // If previous reports were not found, return empty array (instead of throwing)
  var prevReports = getReports(appKey);
  
  check({
      shrinkwrap: app,
      offline: true,
      advisoriesPath: './advisories.json'
  }).then(findSolutions).then(function(vulnerabilities) {
      var result = {
          vulnerable: vulnerabilities.length > 0,
          reportId: reportId
      }
      
      res.write(JSON.stringify(result));
      
      var doc = {
          appId: app.appId,
          name: app.name,
          version: app.version,
          uris: app.uris,
          vulnerabilities: vulnerabilities
      };
      
      return Promise.props({
          docs: db.putAsync(reportKey, doc), 
          reports: prevReports
      });
  }).then(function(results){
      return db.putAsync(appKey, [reportId].concat(results.reports))
  }).then(function(result) {
      res.end();
  }, function(error) {
      //console.error(error.message);
      //console.error(error.stack);
      res.end(error.stack);
  });
}

exports.appAppIdGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * appId (String)
  **/
  
  var appId = args.appId.value;
  var appKey = "app_" + appId;
  
  res.setHeader('Content-Type', 'application/json');
  
  getReports(appKey).then(function(reports) {
      res.end(JSON.stringify(reports, null, 2));
  }).catch(function(error) {
      res.end(error.stack);
  });  
}

