var gulp = require('gulp');

gulp.task('clean', function() {
  var del = require('del');

  return del([
    './dist/'
  ]);
});
