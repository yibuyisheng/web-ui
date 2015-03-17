var gulp = require('gulp');
var path = require("path");
var webpack = require("webpack");

gulp.task('dist', function(callback) {
    webpack({
        entry: {
            ui: path.join(__dirname, 'static', 'js', 'ui.js'),
            base: path.join(__dirname, 'static', 'js', 'base.js')
        },
        output: {
            filename: '[name].js',
            path: path.join(__dirname, 'dist')
        },
        resolve: {
            root: [path.join(__dirname, 'static', "bower_components")]
        },
        plugins: [
            new webpack.ResolverPlugin(
                new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
            )
        ]
    }, function(err, stats) {
        if (err) {
            console.log(err);
        } else {
            console.log('pack success!');
        }
        callback(err, stats);
    });
});
