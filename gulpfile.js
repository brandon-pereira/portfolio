var gulp = require('gulp');
var less = require('gulp-less');
var livereload = require('gulp-livereload');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var webserver = require('gulp-webserver');
var extender = require('gulp-html-extend');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var mainBowerFiles = require('main-bower-files');
var imageResize = require('gulp-image-resize');

var config = {
  'development': true
};

var paths = {
  // Files to transfer directly to dist
  'transfer': [
                './src/static/**/*'
              ],
  // distribution paths
  'dist': {
    'root': './dist',
    'all': './dist/**/*',
    'templates': './dist/templates',
    'img': './dist/projects'
  },
  // source files
  'src': {
    'css': './src/style.less',
    'html': './src/index.html',
    'js': ['./src/app.js', './src/scripts/*.js'],
    'templates': './src/scripts/templates/**/*',
    'img': './src/projects/**/*'
  },
  // watch paths
  'watch': {
    'html': ['./src/index.html', './src/html/**/*.html'],
    'js': ['./src/**/*.js'],
    'css': './src/**/*.less',
    'templates': './src/scripts/templates/**/*',
    'img': './src/projects/**/*'
  }
};

gulp.task('default', ['serve']);
gulp.task('serve', ['build', 'webserver']);
gulp.task('build', ['transfer', 'extend', 'style', 'script', 'images']);

/**
  This function will remove all files and folders from the
  dist folder. 
**/
gulp.task('clean', function() {
  return del(paths.dist.all, {force:true, read: false});
});

/**
 * Task to directly transfer files listed in paths.transfer. Does no
 * modification to files.
 */
gulp.task('transfer', function(){
  return gulp.src(paths.transfer)
    .pipe(gulp.dest(paths.dist.root));
});

/**
  This function will expand the index file (srcIndex) and 
  place the expanded source to the dist folder. Will also
  call for a live reload.
**/
gulp.task('extend', function () {
  return gulp.src(paths.src.html)
    .pipe(extender({annotations:true,verbose:true}))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(livereload());
});

/**
  This function will compile any LESS files inside 
  paths.sec.less, add sourcemaps, minify the css, and output
  it to the /dist folder. Will also call for a live reload.
**/
gulp.task('style', function() {
  return gulp.src(paths.src.css)
    .pipe(sourcemaps.init())
    .pipe(less().on('error', function(err){
      gutil.log(gutil.colors.red('------ERROR------\n'+err.message));
      gutil.beep();
      this.emit('end');
    }))
    .pipe(cleanCSS())
    .pipe(gulpif(config.development, sourcemaps.write()))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(livereload());
});
 
/**
  This function will concatenate src JS files (in order of 
  array), and output to dist folder. Will 
  also trigger a live reload.
**/
gulp.task('script', ['scripts:internal', 'scripts:external', 'scripts:templates']);

gulp.task('scripts:internal', function() {
  return gulp.src(paths.src.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(livereload());
});

gulp.task('scripts:external', function(){
  return gulp.src(mainBowerFiles())
    .pipe(concat('vendor.js'))
    .pipe(gulpif(!config.development, uglify()))
    .pipe(gulp.dest(paths.dist.root));
});

/**
 * JS templates to be transfered directly to dist folder
 */
gulp.task('scripts:templates', function(){
  return gulp.src(paths.src.templates)
     .pipe(gulp.dest(paths.dist.templates))
     .pipe(livereload());
});

gulp.task('images', function(){
  return gulp.src(paths.src.img)
     .pipe(imageResize({width:300, quality: 0.8}))
     .pipe(gulp.dest(paths.dist.img))
     .pipe(livereload());
});

/**
  This function will watch path watch files for changes,
  and if changes are detected (via livereload command),
  will compile the changed file.
**/
gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(paths.watch.css, ['style']);
  gulp.watch(paths.watch.html, ['extend']);
  gulp.watch(paths.watch.js, ['scripts:internal']);
  gulp.watch(paths.watch.templates, ['scripts:templates']);
  gulp.watch(paths.transfer, ['transfer']);
});

/**
  This function will turn on the web server,
  using /dist as base. Will  trigger livereload 
  on change.
**/
gulp.task('webserver', ['watch'], function() {
  return gulp.src(paths.dist.root)
    .pipe(webserver({
      livereload: true, 
      open: true
    }));
});