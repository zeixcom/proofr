var gulp = require('gulp');
var runSequence = require('run-sequence');
var requireDir = require('require-dir');

requireDir('./gulp');


gulp.task('default', function() {
  runSequence(
    'clean',
    ['babel', 'scss']
  );
});

gulp.task('build', function() {
  runSequence(
    'clean',
    ['babel', 'scss'],
    ['uglify', 'minify-css']
  )
});
