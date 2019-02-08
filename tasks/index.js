const gulp =require('gulp');
const del = require('del');
const nunjucksRender = require('gulp-nunjucks-render');
const sass = require('gulp-sass');
const sftp = require('gulp-sftp-clean');
const assert = require('assert');

const DISTRIBUTION_DIRECTORY = './app/www';
const STATIC_DIRECTORY = './src/static';
const JAVASCRIPT_DIRECTORY = './src/js';
const STYLE_DIRECTORY = './src/scss';
const TEMPLATES_DIRECTORY = './src/templates';

gulp.task('clean', function() {
  return del([DISTRIBUTION_DIRECTORY + '/**/*']);
});

gulp.task('static', function () {
  return gulp.src([STATIC_DIRECTORY + '/**/*']).pipe(gulp.dest(DISTRIBUTION_DIRECTORY));
});

gulp.task('js', function () {
  return gulp.src([JAVASCRIPT_DIRECTORY + '/**/*']).pipe(gulp.dest(DISTRIBUTION_DIRECTORY + '/js'));
});

gulp.task('style', function () {
  return gulp.src(STYLE_DIRECTORY + '/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(DISTRIBUTION_DIRECTORY + '/css'));
});

gulp.task('templates', function() {
  // Gets .html and .njk files in pages
  return gulp.src(TEMPLATES_DIRECTORY + '/pages/**/*.+(html|njk)')
    // Renders template with nunjucks
    .pipe(nunjucksRender({
      path: [TEMPLATES_DIRECTORY]
    }))
    // Output files in src folder
    .pipe(gulp.dest(DISTRIBUTION_DIRECTORY));
});


gulp.task('build', gulp.series('clean', gulp.parallel('static', 'templates', 'style', 'js')));

gulp.task('watch', function() {
  gulp.watch(TEMPLATES_DIRECTORY + '/**/*.njk', gulp.series('templates'));
  gulp.watch(STYLE_DIRECTORY + '/**/*.scss', gulp.series('style'));
  gulp.watch(STATIC_DIRECTORY + '/**/*', gulp.series('static'));
  gulp.watch(JAVASCRIPT_DIRECTORY + '/**/*', gulp.series('js'));
});

function getConfig() {
  assert.equal(typeof(process.env.CONVTOOLS), 'string', 'Missing CONVTOOLS environment variable, did you run scripts/config.sh?');
  let config = JSON.parse(process.env.CONVTOOLS);
  assert.equal(typeof(config.host), 'string', 'Missing host information in config, did you run scripts/config.sh?');
  assert.equal(typeof(config.username), 'string', 'Missing username information in config, did you run scripts/config.sh?');
  assert.equal(typeof(config.password), 'string', 'Missing password information in config, did you run scripts/config.sh?');
  assert.equal(typeof(config.remotePath), 'string', 'Missing remotePath information in config, did you run scripts/config.sh?');
  return config;
}

gulp.task('deploy-check', function (done) {
  let config = getConfig();
  console.log('Deploy check: ', JSON.stringify(config));
  done();
});

gulp.task('deploy', function () {
  let config = getConfig();
  console.log('Deploying to website: ', JSON.stringify(config));
  return gulp.src(DISTRIBUTION_DIRECTORY + '/**/*')
    .pipe(sftp(config));
});
