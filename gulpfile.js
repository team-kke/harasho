"use strict";

var gulp = require('gulp')
  , browserify = require('browserify')
  , connect = require('gulp-connect')
  , csso = require('gulp-csso')
  , eslint = require('gulp-eslint')
  , nodemon = require('gulp-nodemon')
  , rimraf = require('gulp-rimraf')
  , rename = require('gulp-rename')
  , stylus = require('gulp-stylus')
  , transform = require('vinyl-transform')
  , through = require('through')
  , uglify = require('gulp-uglify');

var isDist = process.argv.indexOf('serve') === -1;

gulp.task('html', ['clean:html'], function () {
  return gulp.src('frontend/index.html')
    .pipe(gulp.dest('out'))
    .pipe(connect.reload());
});

gulp.task('js', ['lint:frontend', 'clean:js'], function () {
   var browserified = transform(function (filename) {
     var b = browserify(filename);
     b.transform('reactify');
     b.transform('debowerify');
     return b.bundle();
   });

  return gulp.src('frontend/scripts/index.jsx')
    .pipe(browserified)
    .pipe(isDist ? uglify() : through())
    .pipe(rename('build.js'))
    .pipe(gulp.dest('out/js'))
    .pipe(connect.reload());
});

gulp.task('css', ['clean:css'], function () {
  return gulp.src('frontend/styles/index.styl')
    .pipe(stylus({
      'include css': true,
      'paths': ['./node_modules', './bower_components']
    }))
    .pipe(isDist ? csso() : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest('out/css'))
    .pipe(connect.reload());
});

gulp.task('clean', function () {
  return gulp.src('out')
    .pipe(rimraf());
});

gulp.task('clean:html', function () {
  return gulp.src('out/index.html')
    .pipe(rimraf());
});

gulp.task('clean:js', function () {
  return gulp.src('out/js/*')
    .pipe(rimraf());
});

gulp.task('clean:css', function () {
  return gulp.src('out/css/*')
    .pipe(rimraf());
});

gulp.task('connect', ['build'], function () {
  connect.server({
    root: 'out',
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(['frontend/index.html'], ['html']);
  gulp.watch(['frontend/scripts/**/*'], ['js']);
  gulp.watch(['frontend/styles/**/*.styl'], ['css']);
});

gulp.task('lint:frontend', function () {
  return gulp.src('frontend/scripts/**/*')
    .pipe(eslint({configFile: '.eslintrc.frontend'}))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('lint:backend', function () {
  return gulp.src(['backend/**/*.js', 'gulpfile.js'])
    .pipe(eslint({configFile: '.eslintrc.backend'}))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('backend', ['lint:backend'], function () {
  nodemon({script: 'backend/index.js', ext: 'js', watch: 'backend'})
    .on('change', ['lint:backend']);
});

gulp.task('lint', ['lint:frontend', 'lint:backend']);
gulp.task('build', ['clean', 'html', 'js', 'css']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['lint', 'build']);
