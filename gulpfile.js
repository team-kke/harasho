var gulp = require('gulp')
  , browserify = require('browserify')
  , connect = require('gulp-connect')
  , rimraf = require('gulp-rimraf')
  , rename = require('gulp-rename')
  , transform = require('vinyl-transform')
  , through = require('through')
  , uglify = require('gulp-uglify');

var isDist = process.argv.indexOf('serve') === -1;

gulp.task('html', ['clean:html'], function () {
  return gulp.src('frontend/index.html')
    .pipe(gulp.dest('out'))
    .pipe(connect.reload());
});

gulp.task('js', ['clean:js'], function () {
   var browserified = transform(function(filename) {
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

gulp.task('connect', ['build'], function () {
  connect.server({
    root: 'out',
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(['frontend/index.html'], ['html']);
  gulp.watch(['frontend/scripts/**/*'], ['js']);
});

gulp.task('build', ['clean', 'html', 'js']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['build']);
