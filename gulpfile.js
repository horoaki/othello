const gulp    = require('gulp');
const notify  = require("gulp-notify");
const plumber = require("gulp-plumber");
const sass    = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const uglify  = require('gulp-uglify');
const browserSync = require('browser-sync');

//setting : paths
const paths = {
  'root'    : './dist/',
  'html'    : './dist/**/*.html',
  'cssSrc'  : './src/scss/**/*.scss',
  'cssDist'   : './dist/css/',
  'jsSrc' : './src/js/**/*.js',
  'jsDist': './dist/js/'
}

//gulpコマンドの省略
const { watch, series, task, src, dest, parallel } = require('gulp');

//Sass
task('sass', function () {
  return (
    src(paths.cssSrc)
      .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
      .pipe(sass({
        outputStyle: 'expanded'// Minifyするなら'compressed'
      }))
      .pipe(autoprefixer())
      .pipe(dest(paths.cssDist))
  );
});

//JS Compress
task('js', function () {
  return (
    src(paths.jsSrc)
      .pipe(plumber())
      .pipe(uglify())
      .pipe(dest(paths.jsDist))
  );
});

// browser-sync
task('browser-sync', () => {
  return browserSync.init({
      server: {
          baseDir: paths.root
      },
      port: 8080,
      reloadOnRestart: true
  });
});

// browser-sync reload
task('reload', (done) => {
  browserSync.reload();
  done();
});

//watch
task('watch', (done) => {
  watch([paths.cssSrc], series('sass', 'reload'));
  watch([paths.jsSrc], series('js', 'reload'));
  watch([paths.html], series('reload'));
  done();
});
task('default', parallel('watch', 'browser-sync'));