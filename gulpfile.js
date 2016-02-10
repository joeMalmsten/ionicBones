/*global process, require __dirname*/
'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sh = require('shelljs'),
    jshint = require('gulp-jshint'),
    browserify = require('browserify'),
    vinylSource = require('vinyl-source-stream'),
    watchify = require('watchify'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    assign = require('lodash').assign,
    karma = require('karma').server,
    browserSync = require('browser-sync').create(),
    paths = {
        sass: ['./**/*.scss'],
        src: ['./www/src/**/*.js'],
        html: ["./www/views/**/*.html"]
    },
    // wrote this since sass.logError was not handling errors properly and breaking
    handleError = function(error) {
        console.log(error.toString());
        this.emit('end');
    },
    bundle = function() {
        return bundler.bundle()
            // log errors if they happen
            .on('error', gutil.log.bind(gutil, 'Browserify Error'))
            .pipe(vinylSource('bundle.js'))
            // optional, remove if you don't need to buffer file contents
            .pipe(buffer())
            // optional, remove if you dont want sourcemaps
            .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
               // Add transformation tasks to the pipeline here.
            .pipe(sourcemaps.write('./')) // writes .map file
            .pipe(gulp.dest('./www/dist'));
    },
    // add custom browserify options here
    customOpts = {
        entries: ['./www/src/app.js'],
        debug: true
    },
    opts = assign({}, watchify.args, customOpts),
    bundler = watchify(browserify(opts));

gulp.task('default', ['sass', 'lint', 'browserify']);

gulp.task('lint', function() {
    gulp.src(['./www/src/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('sass', function() {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', handleError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .pipe(browserSync.stream());
});


gulp.task('browserify', bundle); // so you can run `gulp js` to build the file

// Static Server + watching scss/html files
gulp.task('watchViews', ['sass'], function() {

    browserSync.init({
        proxy: "localhost:8100"
    });

    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.html).on('change', browserSync.reload);
});

gulp.task('watchBuild', function() {
    bundler.on('update', bundle); // on any dep update, runs the bundler
    bundler.on('log', gutil.log); // output build logs to terminal
    //gulp.watch(paths.sass, ['sasswatch']);
});

gulp.task('sasswatch', function() {
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
