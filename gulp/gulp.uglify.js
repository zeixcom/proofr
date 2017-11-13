var gulp = require('gulp');

gulp.task('uglify', function() {
  var uglify = require('gulp-uglify');

  return gulp.src('./dist/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});
