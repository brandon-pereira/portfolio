module.exports = function(config, gulp) {
	
	const nunjucks = require('gulp-nunjucks-render');
	const data = require('gulp-data');
	const inlinesource = require('gulp-inline-source');
	const htmlmin = require('gulp-htmlmin');
	const browserSync = require('browser-sync').get("server");
	
	gulp.task('html', () =>
		gulp.src(config.paths.src.html)
			.pipe(data(() => ({
				projects: requireUncached('../src/content/projects.json'),
				apps: requireUncached('../src/content/apps.json'),
				skills: requireUncached('../src/content/test.json'),
				contact: requireUncached('../src/content/contact.json')
			})))
			.pipe(nunjucks({
				path: ['./src/html', './src'],
			})).on('error', function(err) {
				console.log('\x1b[31m', 'nunjucksRender error: ', err.message, '\x1b[0m');
				this.emit('end');
			})
			.pipe(inlinesource({
				rootpath: config.paths.src.root
			}).on('error', function(err) {
				console.log('\x1b[31m', 'criticalCSS error: ', err.message, '\x1b[0m');
				this.emit('end');
			}))
			.pipe(htmlmin({collapseWhitespace: true})).on('error', function(err) {
				console.log('\x1b[31m', 'htmlMin error: ', err.message, '\x1b[0m');
				this.emit('end');
			})
			.pipe(gulp.dest(config.paths.dist))
			.pipe(browserSync.stream())
	);
	
	gulp.task('watch:html', () =>
		gulp.watch(config.paths.watch.html, gulp.parallel('html'))
	);
	
};

// De-caching for Data files
function requireUncached($module) {
    delete require.cache[require.resolve($module)];
    return require($module);
}