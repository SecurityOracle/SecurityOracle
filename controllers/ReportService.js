'use strict';

var db = require('../utils/db');

exports.reportReportIdGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * reportId (String)
  **/
  
  res.setHeader('Content-Type', 'application/json');
  
  var reportId = args.reportId.value;
  
  // res.write(JSON.stringify(args.reportId.value));
  // res.end();
  db.getAsync(reportId).then(function(doc) {
      res.end(JSON.stringify(doc, null, 2));
  }, function(error) {
      res.end(JSON.stringify(error.stack));
  });
}

