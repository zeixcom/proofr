var gulp = require('gulp');

gulp.task('scss', function () {

  var scss = require('gulp-sass');
  var stylelint = require('gulp-stylelint');

  return gulp.src('./src/css/*.scss')
    .pipe(stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true
        }
      ]
    }))
    .pipe(scss().on('error', scss.logError))
    .pipe(gulp.dest('./dist/css/'));
});
