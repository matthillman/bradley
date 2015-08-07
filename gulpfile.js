var gulp = require('gulp');
var browserify = require('browserify');
var ngAnnotate = require('gulp-ng-annotate');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');
var run = require('gulp-run');

var tsconfig = ts.createProject('tsconfig.json', { sortOutput: true });

gulp.task('compile', function () {
	return gulp.src(['typings/**/*.d.ts', 'app/**/*.ts'])
		.pipe(ts(tsconfig))
		.js
		.pipe(gulp.dest('build'));
});

gulp.task('minify-css', function () {
	var stream = gulp.src(['node_modules/angular-material/angular-material.css', 'css/*.css']);
	if (global.DEBUG) { stream.pipe(sourcemaps.init()); }
	stream.pipe(minifyCss())
	if (global.DEBUG) { stream.pipe(sourcemaps.write()); }
	return stream.pipe(gulp.dest('dist/assets'));
});

gulp.task('browserify', ['compile'], function () {
	var b = browserify({
		entries: ['./build/main.js'],
		debug: global.DEBUG
	});

	var stream = b.bundle()
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(ngAnnotate());

	if (global.DEBUG) { stream.pipe(sourcemaps.init({ loadMaps: true })); }
	stream
		.pipe(uglify())
		.on('error', gutil.log)
	if (global.DEBUG) { stream.pipe(sourcemaps.write()); }
	return stream.pipe(gulp.dest('./dist/'));
});

gulp.task('copy-source', ['browserify', 'minify-css'], function () {
	return gulp.src(['./dist/**/*']).pipe(gulp.dest('../gh-pages/'))
});

gulp.task('debug', function() {
	global.DEBUG = false;
});

gulp.task('production', function() {
	global.DEBUG = false;
});

gulp.task('publish', ['production', 'copy-source'], function () {
	return run('pushd ../gh-pages && git add --all . && git commit -a -m "Gulp publish" && git push origin HEAD && popd').exec();
})

gulp.task('default', ['debug', 'minify-css', 'browserify']);