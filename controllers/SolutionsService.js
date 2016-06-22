'use strict';

var db = require('../utils/db');

function getSolutions(key) {
  return db.getAsync(key).catch(function(err) {
      return err.notFound;
  }, function() {
      return [];
  });
}

exports.appAppIdSolutionsGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * appId (String)
  **/

  res.setHeader('Content-Type', 'application/json');
  
  var appId = args.appId.value;
  var solutionsKey = "solutions_" + appId;
  
  getSolutions(solutionsKey).then(function(solutions) {
      res.end(JSON.stringify(solutions, null, 2))
  }).catch(function(error) {
      res.end(error.stack);
  });
}

exports.appAppIdSolutionsPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * appId (String)
  * resolution (List)
  **/
  // no response value expected for this operation
    
  var appId = args.appId.value;
  var solutionsKey = "solutions_" + appId;
  
  db.putAsync(solutionsKey, args.resolution.value);
  
  res.end();
}

