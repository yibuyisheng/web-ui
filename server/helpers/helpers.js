var path = require('path');
var fs = require('fs');

function executeGeneratorFn(genFn, callback) {
    var iterator = genFn();

    function execute(nextValue) {
        if (!nextValue.done) {
            nextValue.value(function() {
                try {
                    execute(iterator.next(arguments));
                } catch (e) {
                    callback(e);
                }
            });
        } else {
            callback instanceof Function && callback();
        }
    }

    try {
        execute(iterator.next());
    } catch (e) {
        callback(e);
    }
}

function * mkdirsGen(dir) {
    if (dir.replace(/\s/g, '') === '') return;

    dir = path.normalize(dir);

    var sepIndex = -1;
    do {
        var sepIndex = dir.indexOf(path.sep, sepIndex + 1);

        var dirPath = dir.slice(0, sepIndex === -1 ? dir.length : sepIndex);

        var exists = yield fs.exists.bind(fs, dirPath);
        if (exists[0]) continue;

        var result = yield fs.mkdir.bind(fs, dirPath);
        if (result && result[0]) throw result[0];
    } while (sepIndex + 1);
}

function * rmdirGen(dir) {
    var stack = [dir];

    var dirs = [dir];
    while (stack.length) {
        var top = stack.pop();

        var readdirResult = yield fs.readdir.bind(fs, top);
        if (readdirResult && readdirResult[0]) throw readdirResult[0];
        for (var i = 0, il = readdirResult[1].length; i < il; i += 1) {
            var fullPath = path.join(top, readdirResult[1][i]);

            var statsResult = yield fs.stat.bind(fs, fullPath);
            if (statsResult && statsResult[0]) throw statsResult[0];

            if (statsResult[1].isDirectory()) {
                stack.push(fullPath);
                dirs.push(fullPath);
            } else {
                var unlinkResult = yield fs.unlink.bind(fs, fullPath);
                if (unlinkResult && unlinkResult[0]) throw unlinkResult[0];
            }
        }
    }

    for (var i = dirs.length - 1; i >= 0; i -= 1) {
        var rmdirResult = yield fs.rmdir.bind(fs, dirs[i]);
        if (rmdirResult && rmdirResult[0]) throw rmdirResult[0];
    }
}


exports.mkdirs = function(dir, callback) {
    executeGeneratorFn(mkdirsGen.bind(null, dir), callback);
};

exports.rmdir = function(dir, callback) {
    executeGeneratorFn(rmdirGen.bind(null, dir), callback);
};
