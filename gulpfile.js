'use-strict';

const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const del = require('del');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const sftp = require('gulp-sftp');

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

gulp.task('sass', function () {
  return gulp.src('./app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./out/css'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('boilerplate', 'nunjucks', 'sass')));

gulp.task('default', gulp.series('build'));

gulp.task('watch', function() {
  gulp.watch('app/**/*.njk', gulp.series('nunjucks'));
  gulp.watch('app/**/*.scss', gulp.series('sass'));
  gulp.watch('app/boilerplate/**/*', gulp.series('boilerplate'));
});

gulp.task( 'deploy', function () {
  let config = JSON.parse(process.env.CONVTOOLS);
  config = Object.assign({
    remotePath: '/relate2020/convtools'
  }, config);

  console.log('Deploying to production: ', JSON.stringify(config));

	return gulp.src('./out/**/*')
		.pipe(sftp(config));
});
