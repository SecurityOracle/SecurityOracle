var Promise = require('bluebird');
var _ = require('lodash');

var check = Promise.promisify(require('nsp/lib/check'));
var ls = require('npm-remote-ls').ls;

function lsAsync(name, version, flatten) {
    return new Promise(function(resolve, reject) {
        ls(name, version, flatten, resolve);
    });
}

function ls2shrinkwrap(tree) {
    var rootKey = Object.keys(tree)[0];
    var root = tree[rootKey];
    
    var parts = rootKey.split('@');
    var name = parts[0];
    var version = parts[1];
    
    return {
        name: name,
        version: version,
        dependencies: ls2shrinkwrapDeps(root)
    };
}

function ls2shrinkwrapDeps(tree) {
    return _(tree).map(function(subtree, depstring) {
        var parts = depstring.split('@');
        var name = parts[0];
        var version = parts[1];
        
        return {
            name: name,
            version: version,
            dependencies: ls2shrinkwrapDeps(subtree)
        };
    }).keyBy('name').value();
}

function findSolutions(vulns) {
    var solutions = _.map(vulns, function(vulnerability) {
        return Promise.map(vulnerability.path, function(path) {
            // path[0] is always the root app, path[1] is a direct dependency
            var parts = path[1].split('@');
            var name = parts[0];
            var version = parts[1];
            
            return lsAsync(name, '^'+version).then(ls2shrinkwrap).then(function(deps) {
                return check({
                    shrinkwrap: deps,
                    offline: true,
                    advisoriesPath: './advisories.json'
                }).then(function(vulns) {
                    if (vulns.length == 0) {
                        return deps.name + "@" + deps.version;
                    } else {
                        return null;
                    }
                });
            });
        });
    });
    
    return Promise.map(solutions, function(solution, index) {
        return _.assign({}, vulns[index], {
            solution: solution
        });
    });
}

module.exports = findSolutions;