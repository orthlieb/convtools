const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const del = require('del');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');


gulp.task('default', function () {
    gulp.run('build');
});

gulp.task('build', function(callback) {
  return runSequence('clean',
      ['nunjucks', 'boilerplate'],
      callback);
});

gulp.task('clean', function() {
  return del(['out/**/*']);
});

gulp.task('nunjucks', function() {
  // Gets .html and .njk files in pages
  return gulp.src('app/pages/**/*.+(html|njk)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['app/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('out'))
});

gulp.task('boilerplate', function () {
  return gulp.src(['app/boilerplate/**/*']).pipe(gulp.dest('out'));
});

gulp.task('watch', function() {
  gulp.watch('app/templates/**/*.njk', ['build']);
  gulp.watch('app/boilerplate/**/*.njk', ['boilerplate']);
});
