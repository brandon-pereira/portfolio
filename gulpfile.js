var gulp = require('gulp');
var sass = require('gulp-sass');
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
var autoprefixer = require('gulp-autoprefixer');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var argv = require('yargs').argv;
var imageResize = require('gulp-image-resize');

var paths = {
  // Files to transfer directly to dist
  'transfer': [
                './src/static/**/*'
                // ,'./path/to/folder.orFile'
              ],
  // distribution paths
  'dist': {
    'root': './dist',
    'all': './dist/**/*',
    'templates': './dist/templates',
    'img': './dist/projects',
    'video': './dist/projects'
  },
  // source files
  'src': {
    'css': './src/styles/style.scss',
    'html': './src/index.html',
    'js': ['./src/scripts/app.js', './src/scripts/**/*.js'],
    'templates': './src/scripts/templates/**/*',
    'img': './src/projects/**/*.{png,jpeg,gif}',
    'video': './src/projects/**/*.mp4'
  },
  // watch paths
  'watch': {
    'html': ['./src/index.html', './src/html/**/*.html'],
    'js': './src/scripts/**/*.js',
    'css': ['./src/**/*.scss', './src/**/*.css'],
    'templates': './src/scripts/templates/**/*',
    'img': './src/projects/**/*'
  }
};

gulp.task('default', ['serve']);
gulp.task('serve', ['build', 'webserver']);
gulp.task('build', ['transfer', 'extend', 'images', 'video', 'style', 'script']);

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
    .pipe(extender({annotations:false,verbose:false}))
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
    .pipe(sass().on('error', errorCallback))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulpif(!argv.production, sourcemaps.write()))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(livereload());
});

gulp.task('images', function(){
  return gulp.src(paths.src.img)
     .pipe(imageResize({width:800, quality: 0.5}))
     .pipe(gulp.dest(paths.dist.img))
     .pipe(livereload());
});

gulp.task('video', function(){
  return gulp.src(paths.src.video)
     .pipe(gulp.dest(paths.dist.video))
     .pipe(livereload());
});
 
/**
  This function will concatenate srcJS files (in order of 
  array), add sourcemaps, and output to dist folder. Will 
  also trigger a live reload.
**/
gulp.task('script', ['scripts:internal', 'scripts:external', 'scripts:templates']);

gulp.task('scripts:internal', function() {
  return gulp.src(paths.src.js)
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(uglify({mangle: false}).on('error', errorCallback))
    .pipe(gulpif(!argv.production, sourcemaps.write()))
    .pipe(gulp.dest(paths.dist.root))
    .pipe(livereload());
});

gulp.task('scripts:external', function(){
  return gulp.src(mainBowerFiles('**/*.js'))
    .pipe(concat('vendor.min.js'))
    .pipe(gulpif(argv.production, uglify()))
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
  gulp.watch(paths.watch.graphics, ['graphics']);
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

var errorCallback = function(err){
    gutil.log(gutil.colors.red('------ERROR------\n'+err.message));
    gutil.beep();
    this.emit('end');
};