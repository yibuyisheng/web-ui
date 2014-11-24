var path = require('path');
var fs = require('fs');

var slashTrim = new RegExp('(^\\' + path.sep + ')|(\\' + path.sep + '$)');

/**
 * 按照给定的目录递归的创建不存在的目录。
 * 例子：rootPath='/etc', relativePath='a/b/c'，那么/etc目录必须存在；
 * relativePath中的目录可以存在，也可以不存在，如果不存在，则会创建相应的目录，
 * 所以最终构造出来的目录是：/etc/a/b/c
 *
 * @param  {string}   rootPath     在指定的目录下面创建
 * @param  {string}   relativePath 需要创建的目录
 * @param  {Function} callback     创建完成的回调函数
 */
function mkdirs(rootPath, relativePath, callback) {
    relativePath = relativePath.replace(slashTrim, '');
    var firstSepIndex = relativePath.indexOf(path.sep);
    if (firstSepIndex !== -1) {
        var fullPath = path.join(rootPath, relativePath.slice(0, firstSepIndex));
        fs.exists(fullPath, function(exists) {
            if (exists) {
                mkdirs(
                    path.join(rootPath, relativePath.slice(0, firstSepIndex)), 
                    relativePath.slice(firstSepIndex), 
                    callback
                );
            } else {
                fs.mkdir(fullPath, function(error) {
                    if (error) return callback(error);
                    mkdirs(
                        path.join(rootPath, relativePath.slice(0, firstSepIndex)), 
                        relativePath.slice(firstSepIndex), 
                        callback
                    );
                });
            }
        });
    } else {
        var fullPath = path.join(rootPath, relativePath);
        fs.exists(fullPath, function(exists) {
            if (exists) {
                callback();
            } else {
                fs.mkdir(fullPath, callback);
            }
        });
    }
}

exports.mkdirs = mkdirs;
