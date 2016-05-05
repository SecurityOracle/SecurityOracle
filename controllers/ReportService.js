'use strict';

exports.reportReportIdGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * reportId (String)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "vulnerable" : true,
  "report_id" : "aeiou"
};
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

