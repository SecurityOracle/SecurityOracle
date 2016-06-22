'use strict';

var url = require('url');


var Solutions = require('./SolutionsService');


module.exports.appAppIdSolutionsGET = function appAppIdSolutionsGET (req, res, next) {
  Solutions.appAppIdSolutionsGET(req.swagger.params, res, next);
};

module.exports.appAppIdSolutionsPOST = function appAppIdSolutionsPOST (req, res, next) {
  Solutions.appAppIdSolutionsPOST(req.swagger.params, res, next);
};
