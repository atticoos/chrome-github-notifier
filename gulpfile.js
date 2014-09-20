var gulp = require('gulp'),
    less = require('gulp-less');


gulp.task('less', function () {
  gulp.src('extension/styles/global.less')
  .pipe(less())
  .pipe(gulp.dest('extension/styles'));
});
gulp.task('default', ['less']);
gulp.task('watch', ['less'], function () {
  gulp.watch('extension/styles/*.less', ['less']);
})
