var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webserver = require('gulp-webserver'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat');
    path = require('path');

var env,
    jsSources,
    outputDir;

env = 'development';

if (env==='development') {
  outputDir = 'builds/development/';
} else {
  outputDir = 'builds/production/';
}

jsSources = [
  'components/scripts/facebook.js',
  'components/scripts/youtube.js',
  'components/scripts/flickr.js',
  'components/scripts/twitter.js'
];

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .on('error', gutil.log)
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
});

gulp.task('css', function() {
  gulp.src('builds/development/css/*.css')
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'css')))
});

gulp.task('watch', function() {
  gulp.watch(jsSources, ['js']);
  gulp.watch(['builds/development/css/*.css'], ['css']);
  gulp.watch('builds/development/*.html', ['html']);
});

gulp.task('webserver', function() {
  gulp.src('builds/development/')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('html', function() {
  gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'production', minifyHTML()))
    .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
});

// Copy images to production
gulp.task('move', function() {
  gulp.src('builds/development/images/**/*.*')
  .pipe(gulpif(env === 'production', gulp.dest(outputDir+'images')))
});

gulp.task('default', ['watch', 'html', 'js', 'css', 'move', 'webserver']);
