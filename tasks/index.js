const gulp =require('gulp');
const del = require('del');
const nunjucksRender = require('gulp-nunjucks-render');
const sass = require('gulp-sass');
const sftp = require('gulp-sftp-clean');
const assert = require('assert');

const { templates } = require('./templates');

gulp.task('templates', templates);

gulp.task('clean', function() {
  return del(['dist/**/*']);
});

gulp.task('static', function () {
  return gulp.src(['src/static/**/*']).pipe(gulp.dest('dist'));
});

gulp.task('style', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('static', templates, 'style')));

gulp.task('watch', function() {
  gulp.watch('src/templates/**/*.njk', gulp.series('templates'));
  gulp.watch('src/pages/**/*.njk', gulp.series('templates'));
  gulp.watch('src/scss/**/*.scss', gulp.series('style'));
  gulp.watch('src/static/**/*', gulp.series('static'));
});

gulp.task( 'deploy', function () {
  assert.equal(typeof(process.env.CONVTOOLS), 'string', 'Missing CONVTOOLS environment variable, did you run scripts/config.sh?');
  let config = JSON.parse(process.env.CONVTOOLS);

  assert.equal(typeof(config.host), 'string', 'Missing host information in config, did you run scripts/config.sh?');
  assert.equal(typeof(config.username), 'string', 'Missing username information in config, did you run scripts/config.sh?');
  assert.equal(typeof(config.password), 'string', 'Missing password information in config, did you run scripts/config.sh?');
  assert.equal(typeof(config.remotePath), 'string', 'Missing remotePath information in config, did you run scripts/config.sh?');
  console.log('Deploying to production: ', JSON.stringify(config));

	return gulp.src('./dist/**/*')
    .pipe(sftp(config));
});
