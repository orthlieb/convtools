const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');

module.exports = {
  templates: function() {
    // Gets .html and .njk files in pages
    return gulp.src('src/pages/**/*.+(html|njk)')
      // Renders template with nunjucks
      .pipe(nunjucksRender({
        path: ['src/templates']
      }))
      // Output files in src folder
      .pipe(gulp.dest('dist'))
  }
};
