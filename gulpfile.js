var gulp = require('gulp');
var runSequence = require('run-sequence');
var requireDir = require('require-dir');

requireDir('./gulp');

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['babel']);
  gulp.watch('./src/**/*.scss', ['scss']);
});

gulp.task('default', function() {
  runSequence(
    'clean',
    ['babel', 'scss'],
    'watch'
  );
});

gulp.task('build', function() {
  runSequence(
    'clean',
    ['babel', 'scss'],
    ['uglify', 'minify-css']
  )
});
