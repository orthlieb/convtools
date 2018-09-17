const gulp =require('gulp');
const del = require('del');
const nunjucksRender = require('gulp-nunjucks-render');
const sass = require('gulp-sass');

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
