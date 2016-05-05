'use strict';

var url = require('url');


var Report = require('./ReportService');


module.exports.reportReportIdGET = function reportReportIdGET (req, res, next) {
  Report.reportReportIdGET(req.swagger.params, res, next);
};
