var path = require('path');
var fs = require('fs');

function executeGeneratorFn(genFn, callback) {
    var iterator = genFn();

    function execute(nextValue) {
        if (!nextValue.done) {
            nextValue.value(function(args) {
                try {
                    execute(iterator.next(args));
                } catch (e) {
                    callback(e);
                }
            });
        } else {
            callback instanceof Function && callback();
        }
    }

    execute(iterator.next());
}

function * mkdirsGen(dir) {
    if (dir.replace(/\s/g, '') === '') return;

    dir = path.normalize(dir);

    var sepIndex = -1;
    do {
        var sepIndex = dir.indexOf(path.sep, sepIndex + 1);

        var dirPath = dir.slice(0, sepIndex === -1 ? dir.length : sepIndex);
        console.log(dirPath);

        var exists = yield fs.exists.bind(fs, dirPath);
        if (exists[0]) continue;

        var result = yield fs.mkdir.bind(fs, dirPath);
        if (result && result[0]) throw result[0];
    } while (sepIndex + 1);
}

function * rmdirGen(dir) {
    // TODO
}


exports.mkdirs = function(dir, callback) {
    executeGeneratorFn(mkdirsGen.bind(null, dir), callback);
};
