var gulp = require('gulp');
var browserify = require('browserify');
var ngAnnotate = require('gulp-ng-annotate');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var ts = require('gulp-typescript');

var tsconfig = ts.createProject('tsconfig.json', { sortOutput: true });

gulp.task('compile', function () {
	return gulp.src(['typings/**/*.d.ts', 'app/**/*.ts'])
		.pipe(ts(tsconfig))
		.js
		.pipe(gulp.dest('build'));
});

gulp.task('browserify', ['compile'], function() {
	var b = browserify({
		entries: ['./build/main.js'],
		debug: true
	});

  return b.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
	.pipe(ngAnnotate())
	.pipe(uglify())
	.on('error', gutil.log)
    .pipe(gulp.dest('./dist/'));
});

gulp.task('publish', ['browserify'], function() {
	return gulp.src(['./dist/**/*']).pipe(gulp.dest('../gh-pages/'))
});

gulp.task('default', ['browserify']);