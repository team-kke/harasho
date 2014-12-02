var gulp = require('gulp')
  , connect = require('gulp-connect')
  , rimraf = require('gulp-rimraf');

gulp.task('html', ['clean:html'], function () {
  return gulp.src('frontend/index.html')
    .pipe(gulp.dest('out'))
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

gulp.task('connect', ['build'], function () {
  connect.server({
    root: 'out',
    livereload: true
  });
});

gulp.task('watch', function () {
  gulp.watch(['frontend/index.html'], ['html']);
});

gulp.task('build', ['clean', 'html']);
gulp.task('serve', ['connect', 'watch']);
gulp.task('default', ['build']);
