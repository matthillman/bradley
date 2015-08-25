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
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var gulpif = require('gulp-if');
var streamqueue = require('streamqueue');
var concat = require('gulp-concat');

var tsconfig = ts.createProject('tsconfig.json', { sortOutput: true });

gulp.task('compile', function () {
	return gulp.src(['typings/**/*.d.ts', 'app/**/*.ts'])
		.pipe(ts(tsconfig))
		.js
		.pipe(gulp.dest('build'));
});

gulp.task('minify-css', function () {
	var staticStream = gulp.src(['node_modules/angular-material/angular-material.css'])
		.pipe(gulpif(!global.DEBUG, minifyCss()));

	var scssStream = gulp.src(['app/scss/styles.scss'])
		.pipe(sass({
			sourceComments: global.DEBUG,
			outputStyle: global.DEBUG ? 'expanded' : 'compressed'
		}))
		.pipe(autoprefixer({
			browsers: [
				'IE >= 10',
				'Safari >= 8',
				'last 2 Chrome versions',
				'last 2 Firefox versions'
			]
		}));

	return streamqueue({objectMode: true},
			staticStream,
			scssStream
		)
		.pipe(concat('styles.css'))
		.on('error', gutil.log)
		.pipe(gulp.dest('./dist/assets/'));
});

gulp.task('browserify', ['compile'], function () {
	var b = browserify({
		entries: ['./build/main.js'],
		debug: global.DEBUG
	});

	return b.bundle()
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(ngAnnotate())
		.pipe(gulpif(global.DEBUG, sourcemaps.init({ loadMaps: true })))
		.pipe(gulpif(!global.DEBUG, uglify()))
		.on('error', gutil.log)
		.pipe(gulpif(global.DEBUG, sourcemaps.write()))
		.pipe(gulp.dest('./dist/'));
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