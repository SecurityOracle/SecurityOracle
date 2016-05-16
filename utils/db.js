var Promise = require("bluebird");

var levelup = require('level')
var db = Promise.promisifyAll(levelup('./reports', {
    valueEncoding: 'json'
}));

module.exports = db;