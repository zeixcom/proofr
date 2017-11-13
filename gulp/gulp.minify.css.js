var gulp = require('gulp');

gulp.task('minify-css', function() {
  var cleanCSS = require('gulp-clean-css');

  return gulp.src('./dist/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/css'));
})
