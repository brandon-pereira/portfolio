module.exports = function(config, gulp) {
	
	const nunjucks = require('gulp-nunjucks-render');
	const data = require('gulp-data');
	const inlinesource = require('gulp-inline-source');
	const htmlmin = require('gulp-htmlmin');
	const browserSync = require('browser-sync').get("server");
	
	gulp.task('html', () =>
		gulp.src(config.paths.src.html)
			.pipe(data(() => ({
				projects: require('../src/content/projects.json'),
				apps: require('../src/content/apps.json'),
				skills: require('../src/content/skills.json'),
				contact: require('../src/content/contact.json')
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
			.pipe(htmlmin({collapseWhitespace: true}))
			.pipe(gulp.dest(config.paths.dist))
			.pipe(browserSync.stream())
	);
	
	gulp.task('watch:html', () =>
		gulp.watch(config.paths.watch.html, gulp.parallel('html'))
	);
	
};