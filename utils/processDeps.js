var _ = require('lodash');

function processDeps(deps) {
    var temp = _.keyBy(deps, 'name');
    
    return _.mapValues(temp, function(dep) {
        if (dep.dependencies) {
            dep.dependencies = processDeps(dep.dependencies);
        }
        
        return dep;
    });
}

module.exports = processDeps;