var gulp = require('gulp');
var path = require("path");
var webpack = require("webpack");

gulp.task('dist', function(callback) {
    webpack({
        entry: {
            ui: path.join(__dirname, 'static', 'js', 'ui.js')
        },
        output: {
            filename: '[name].js',
            path: path.join(__dirname, 'dist')
        }
    }, function(err, stats) {
        if (err) {
            console.log(err);
        } else {
            console.log('pack success!');
        }
        callback(err, stats);
    });
});
