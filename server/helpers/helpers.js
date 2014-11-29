var path = require('path');
var fs = require('fs');

function executeGeneratorFn(genFn, callback) {
    var iterator = genFn();

    function execute(nextValue) {
        if (!nextValue.done) {
            nextValue.value(next);
        } else {
            callback instanceof Function && callback();
        }
    }

    function next() {
        try {
            execute(iterator.next(arguments));
        } catch (e) {
            callback(e);
        }
    }

    next();
}

function throwError(result) {
    if (result && result[0]) throw result[0];
    return result;
}

function * mkdirsGen(dir) {
    if (dir.replace(/\s/g, '') === '') throw new Error('the directory is empty string');

    dir = path.resolve(dir);

    var sepIndex = -1;
    do {
        var sepIndex = dir.indexOf(path.sep, sepIndex + 1);

        var dirPath = dir.slice(0, sepIndex === -1 ? dir.length : (sepIndex + 1));

        var exists = yield fs.exists.bind(fs, dirPath);
        if (exists[0]) continue;

        throwError(yield fs.mkdir.bind(fs, dirPath));
    } while (sepIndex + 1);
}

function * rmdirGen(dir) {
    var stack = [dir];

    var dirs = [dir];
    while (stack.length) {
        var top = stack.pop();

        var readdirResult = throwError(yield fs.readdir.bind(fs, top));
        for (var i = 0, il = readdirResult[1].length; i < il; i += 1) {
            var fullPath = path.join(top, readdirResult[1][i]);

            var statsResult = throwError(yield fs.stat.bind(fs, fullPath));

            if (statsResult[1].isDirectory()) {
                stack.push(fullPath);
                dirs.push(fullPath);
            } else {
                var unlinkResult = throwError(yield fs.unlink.bind(fs, fullPath));
            }
        }
    }

    for (var i = dirs.length - 1; i >= 0; i -= 1) {
        var rmdirResult = throwError(yield fs.rmdir.bind(fs, dirs[i]));
    }
}

function * cpGen(srcPath, destPath) {
    if (!destPath.replace(/\s/g, '')) throw new Error('the destination path is an empty string');

    srcPath = path.resolve(srcPath);
    destPath = path.resolve(destPath);

    if (!(yield fs.exists.bind(fs, srcPath))[0]) throw new Error('the source file is not exists');

    var readStream = fs.createReadStream(srcPath);
    var writeStream = fs.createWriteStream(destPath);

    readStream.pipe(writeStream);

    function end(callback) {
        writeStream.on('error', callback);
        writeStream.on('finish', callback);
    }
    throwError(yield end.bind(null));
}

function * cpdirGen(srcDir, destDir) {
    srcDir = path.resolve(srcDir);
    destDir = path.resolve(destDir);

    if (!(yield fs.exists.bind(fs, srcDir))[0]) throw new Error('the source directory is not exists');

    // 创建目标目录
    yield executeGeneratorFn.bind(null, mkdirsGen.bind(null, destDir));

    var stack = [srcDir];
    while (stack.length) {
        var top = stack.pop();
        var readdirResult = throwError(yield fs.readdir.bind(fs, top));
        for (var i = 0, il = readdirResult[1].length; i < il; i += 1) {
            var fullPath = path.join(top, readdirResult[1][i]);
            var statResult = throwError(yield fs.stat.bind(fs, fullPath));
            if (statResult[1].isDirectory()) {
                throwError(yield fs.mkdir.bind(fs, fullPath.replace(srcDir, destDir)));
                stack.push(fullPath);
            } else {
                throwError(yield executeGeneratorFn.bind(null, cpGen.bind(null, fullPath, fullPath.replace(srcDir, destDir))));
            }
        }
    }
}

function * mvGen(srcPath, destPath) {
    if (!destPath.replace(/\s/g, '')) throw new Error('the destination path is an empty string');

    srcPath = path.resolve(srcPath);
    destPath = path.resolve(destPath);

    if (!(yield fs.exists.bind(fs, srcPath))[0]) throw new Error('the source file is not exists');

    // 判断目标目录是不是存在
    var destDir = destPath.slice(0, destPath.lastIndexOf(path.sep));
    if (!(yield fs.exists.bind(fs, destDir))) {
        throw new Error('the destination directory is not exists');
    }

    // 创建目标文件
    throwError(yield fs.writeFile(fs, destPath, ''));
    // 判断是不是在同一个硬盘区域
    var srcDevice = throwError(yield fs.stat.bind(fs, srcPath))[1].dev;
    var destDevice = throwError(yield fs.stat.bind(fs, destPath))[2].dev;

    // 在同一个硬盘区域
    if (srcDevice === destDevice) {
        throwError(yield fs.unlink.bind(fs, destPath));
        throwError(yield fs.rename.bind(fs, srcPath, destPath));
    }
    // 在不同的硬盘区域
    else {
        throwError(yield executeGeneratorFn.bind(null, cpGen.bind(null, srcPath, destPath)));
        throwError(yield fs.unlink.bind(null, srcPath));
    }
}

function * mvdirGen(srcDir, destDir) {
    if (!destDir.replace(/\s/g, '')) throw new Error('the destination directory is an empty string');

    srcPath = path.resolve(srcDir);
    destPath = path.resolve(destDir);

    if (!(yield fs.exists.bind(fs, srcPath))[0]) throw new Error('the source directory is not exists');

    throwError(yield mkdirs.bind(null, destDir));

    var dirs = [srcDir]; // 等待删除的文件夹
    var stack = [srcDir];
    while (stack.length) {
        var top = stack.pop();

        var files = throwError(yield fs.readdir.bind(null, top))[1];
        for (var i = 0, il = files.length; i < il; i += 1) {
            var fullPath = path.join(top, files[i]);
            var isDirectory = throwError(yield fs.stat.bind(fs, fullPath))[1].isDirectory();
            if (isDirectory) {
                throwError(yield fs.mkdir.bind(fs, fullPath.replace(srcDir, destDir)));
                stack.push(fullPath);
                dirs.push(fullPath);
            } else {
                throwError(yield mv.bind(fs, fullPath, fullPath.replace(srcDir, destDir)));
            }
        }
    }

    for (var i = dirs.length - 1; i >= 0; i -= 1) {
        throwError(yield fs.rmdir.bind(fs, dirs[i]));
    }
}

function mvdir(srcDir, destDir, callback) {
    executeGeneratorFn(mvdirGen.bind(null, srcDir, destDir), callback);
}

function mv(srcPath, destPath, callback) {
    executeGeneratorFn(mvGen.bind(null, srcPath, destPath), callback);
}
function cpdir(srcDir, destDir, callback) {
    executeGeneratorFn(cpdirGen.bind(null, srcDir, destDir), callback);
}
function cp(srcPath, destPath, callback) {
    executeGeneratorFn(cpGen.bind(null, srcPath, destPath), callback);
}
function mkdirs(dir, callback) {
    executeGeneratorFn(mkdirsGen.bind(null, dir), callback);
}
function rmdir(dir, callback) {
    executeGeneratorFn(rmdirGen.bind(null, dir), callback);
}


module.exports = {
    mv: mv,
    cpdir: cpdir,
    cp: cp,
    mkdirs: mkdirs,
    rmdir: rmdir,
    mvdir: mvdir
};
