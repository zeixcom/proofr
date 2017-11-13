var gulp = require('gulp');

gulp.task('babel', function() {
  var babel = require('gulp-babel');
  var eslint = require('gulp-eslint');

  return gulp.src('./src/js/*{.es6, .js}')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('./dist'))
});
