'use strict';

var url = require('url');


var App = require('./AppService');


module.exports.appPOST = function appPOST (req, res, next) {
  App.appPOST(req.swagger.params, res, next);
};
