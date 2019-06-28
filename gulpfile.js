var gulp = require('gulp'),
    sass = require('gulp-sass');
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-clean-css'),
    uglify = require('gulp-uglifyjs');


gulp.task('sass', function(done) {
  gulp.src("app/scss/**/*.scss")
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions'], {cascade: true}))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream({stream: true}))

  done();
});

gulp.task('minijs', function(done) {
   return gulp.src([
     'app/js/libs/**/*.js',
     'app/js/libs/**/*.min.js',
   ])
   .pipe(concat('libs.min.js'))
   .pipe(uglify())
   .pipe(gulp.dest('app/js'))
   .pipe(browserSync.stream({stream: true}));

   done();
});

gulp.task('minicss', function(done) {
   return gulp.src([
     'app/css/libs/**/*.css',
     'app/css/libs/**/*.min.css',
   ])
   .pipe(concat('libs.min.css'))
   .pipe(cssmin())
   .pipe(gulp.dest('app/css'));

   done();
});

gulp.task('browser-sync', function() {
  browserSync ({
    server: {
      baseDir: 'app'
    },
     notify: false,
  });
  browserSync.watch('app/').on('change', browserSync.reload);
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clear', function() {
  return cache.clearaAll();
});

gulp.task('img', function() {
  return gulp.src('app/img/**/*')
  .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 9}),
      imagemin.svgo({
          plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
          ]
      })
  ]))
  .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', function(done) {
  gulp.watch('app/sass/**/*.sass', gulp.series('sass'));
  gulp.watch('app/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('app/*.html').on('change', browserSync.reload);
  gulp.watch('app/js/**/*.js').on('change', browserSync.reload);

  done();
});

gulp.task ('build', function(done) {

  var buildCss = gulp.src('app/css/*.css')
  .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/*.js')
  .pipe(gulp.dest('dist/js'));

  var buildImg = gulp.src('app/img/*')
  .pipe(gulp.dest('dist/img'));

  var buildHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));

  done();
});

gulp.task('default', gulp.series('watch', 'sass', 'minijs', 'minicss', 'browser-sync'));
gulp.task(gulp.series('img','build','clean', 'sass'));
