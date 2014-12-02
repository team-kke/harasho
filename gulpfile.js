var gulp = require('gulp')
  , rimraf = require('gulp-rimraf');

gulp.task('html', function () {
  return gulp.src('frontend/index.html')
    .pipe(gulp.dest('out/index.html'));
});

gulp.task('clean', function () {
  return gulp.src('out')
    .pipe(rimraf());
});

gulp.task('clean:html', function () {
  return gulp.src('out/index.html')
    .pipe(rimraf());
});

gulp.task('default', []);
