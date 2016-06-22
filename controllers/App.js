'use strict';

var url = require('url');


var App = require('./AppService');


module.exports.appAppIdGET = function appAppIdGET (req, res, next) {
  App.appAppIdGET(req.swagger.params, res, next);
};

module.exports.appPOST = function appPOST (req, res, next) {
  App.appPOST(req.swagger.params, res, next);
};
