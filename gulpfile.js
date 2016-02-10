/*global process, require */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sh = require('shelljs'),
    jshint = require('gulp-jshint'),
    browserify = require('browserify'),
    vinylSource = require('vinyl-source-stream'),
    karma = require('karma').server;

var paths = {
    sass: ['./**/*.scss'],
    src: ['./www/src/**/*.js']
};

// wrote this since sass.logError was not handling errors properly and breaking
//   the watch - Joe M
var handleError = function(error) {
    console.log(error.toString());

    this.emit('end');
};

gulp.task('default', ['sass', 'lint', 'browserify']);

gulp.task('lint', function() {
    gulp.src(['./www/src/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('browserify', function() {
    return browserify('./www/src/app.js', {debug: true})
        .bundle()
        .pipe(vinylSource('bundle.js'))
        .pipe(gulp.dest('./www/dist'));
});

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', handleError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
});

/**
* Test task, run test once and exit
*/
gulp.task('test', function() {
    karma.start({
        configFile: __dirname + '/www/karma.conf.js'
    });
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
          '  ' + gutil.colors.red('Git is not installed.'),
          '\n  Git, the version control system, is required to download Ionic.',
          '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
          '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
