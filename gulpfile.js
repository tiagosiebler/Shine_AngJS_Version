var gulp 		= require('gulp')
var concat 		= require('gulp-concat')
var sourcemaps 	= require('gulp-sourcemaps')
var uglify 		= require('gulp-uglify')
var ngAnnotate 	= require('gulp-ng-annotate')
var zip 		= require('gulp-zip');
var notify 		= require("gulp-notify");
var ignore 		= require('gulp-ignore');
var rename       = require('gulp-rename');
var rimraf 		= require('gulp-rimraf');
var minifycss   = require('gulp-uglifycss');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var sass         = require('gulp-sass');
var runSequence  = require('run-sequence'); // 'hack' that should be removed when gulp 4 is out
//var filter       = require('gulp-filter');
var cmq          = require('gulp-group-css-media-queries');
var htmlmin 	 = require('gulp-htmlmin');

// Project configuration
var project 		= 'newcp', // Project name, used for build zip.
	url 			= 'localhost', // Local Development URL for BrowserSync. Change as-needed.
	build 			= './app/', // Files that you want to package into a zip go here
	buildInclude 	= [	// not used yet
						// include common file types
						'**/*.php',
						'**/*.html',
						'**/*.css',
						'**/*.js',
						'**/*.svg',
						'**/*.ttf',
						'**/*.otf',
						'**/*.eot',
						'**/*.woff',
						'**/*.woff2',

						// include specific files and folders
						'screenshot.png',

						// exclude files and folders
						'!node_modules/**/*',
						'!assets/bower_components/**/*',
						'!style.css.map',
						'!assets/js/custom/*',
						'!assets/css/patrials/*'
					];
					
					
					
gulp.task('buildJSVendors', function () {
	return gulp.src([
			'./src/js/vendors/**/jquery*.min.js',
			'./src/js/vendors/**/angular.min.js',
			'./src/js/vendors/**/angular-*.js',
			'./src/js/vendors/**/ng-table.min.js',
			'./src/js/vendors/**/*bootstrap*.js'])
	  
		.pipe(sourcemaps.init())
		.pipe(concat('vendors.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('./app/js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./app/js'))
//		.pipe(notify({ message: 'JS vendors task complete', onLast: true }));
})

gulp.task('buildJSApp', function () {
	return gulp.src([
			'./src/js/app/**/*.js'])
	  
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('./app/js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./app/js'))
//		.pipe(notify({ message: 'JS app task complete', onLast: true }));
})

gulp.task('buildJS', function(done) {
    return runSequence('buildJSVendors','buildJSApp', function() {
        console.log('BuildJS done');
        done();
    });
});

gulp.task('buildCSS', function () {
 	return gulp.src([
		'./src/css/style.css', 
		'./src/css/toaster/toaster.css'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(concat('style.css'))
		.pipe(sass({
			errLogToConsole: true,
	
			//outputStyle: 'compressed',
			outputStyle: 'compact',
			// outputStyle: 'nested',
			// outputStyle: 'expanded',
			precision: 10
		}))
		.pipe(sourcemaps.write({includeContent: false}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(autoprefixer('last 2 version', '> 1%', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		//.pipe(autoprefixer())
		.pipe(sourcemaps.write('.'))
		.pipe(plumber.stop())
		.pipe(gulp.dest('./app/css'))
 		.pipe(ignore('**/*.map'))
		.pipe(cmq()) // Combines Media Queries
		//.pipe(reload({stream:true})) // Inject Styles when style file is created
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss({
			maxLineLen: 80
		}))
		.pipe(gulp.dest('./app/css'))
		//.pipe(reload({stream:true})) // Inject Styles when min style file is created
//		.pipe(notify({ message: 'Styles task complete', onLast: true }))
});

gulp.task('buildHTML', function() {
	return gulp.src(['./src/**/*.html'])
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./app'))
//		.pipe(notify({ message: 'HTML task complete', onLast: true }));
});

gulp.task('buildZip', function () {
	// make zip of app contents
	return 	gulp.src(build+'/**/',{dot: true})
		.pipe(zip(project+'.zip'))
		.pipe(gulp.dest('./'))
		.pipe(notify({ message: 'Build process complete', onLast: true }));
});

// not used yet
gulp.task('images', function() {
	// Add the newer pipe to pass through newer images only
	return 	gulp.src(['./assets/img/raw/**/*.{png,jpg,gif}'])
		.pipe(newer('./assets/img/'))
		.pipe(rimraf({ force: true }))
		.pipe(imagemin({ optimizationLevel: 7, progressive: true, interlaced: true }))
		.pipe(gulp.dest('./assets/img/'))
		.pipe(notify( { message: 'Images task complete', onLast: true } ) );
});

// clean compiled files, remove ds_store files
gulp.task('clean', function() {
 	return 	gulp.src([
		project+'.zip',
		'./app/js/app.js',
		'./app/js/app.js.map',
		'./app/js/vendors.js',
		'./app/js/vendors.js.map',
		'./app/css/style.css',
		'./app/css/style.min.css',
		'./app/css/style.css.map',
		'./app/**/*.html',
		'**/.DS_Store'], { read: false }) // much faster
 		.pipe(ignore('src/**'))
 		.pipe(ignore('node_modules/**')) //Example of a directory to ignore
 		.pipe(rimraf({ force: true }))
// 		.pipe(notify({ message: 'Clean task complete', onLast: true }));
});

// main build task. Clean old delta files, build, then zip ready for distribution to prod
gulp.task('build', function(done) {
    runSequence('clean','buildHTML', 'buildJS', 'buildCSS', 'buildZip', function() {
//        console.log('Process complete');
        done();
    });
});
