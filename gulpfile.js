var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('merge', function() {
    gulp.src('./static/js/src/**/*.js')
    .pipe(concat('all.js')).pipe(gulp.dest('./static/dist/'));
});
