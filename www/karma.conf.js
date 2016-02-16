// Karma configuration
// Generated on Thu Feb 04 2016 13:24:43 GMT-0800 (PST)
/*global require module*/
'use strict';

module.exports = function(karma) {
    var istanbul = require('browserify-istanbul');
    karma.set({



        logLevel: karma.LOG_DEBUG,
        singleRun: true,
        autoWatch: false,
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        frameworks: [
            'jasmine',
            'browserify'
        ],

        // list of files / patterns to load in the browser
        files: [
            '../node_modules/angular/angular.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            '../node_modules/jquery/dist/jquery.js',
            'test/**/*.spec.js'

        ],

        preprocessors: {
            'test/**/*.spec.js': ['browserify']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'coverage'],

        specReporter: {
            maxLogLines: 10,         // limit number of lines logged per test
            suppressErrorSummary: false,  // do not print error summary
            suppressFailed: false,  // do not print information about failed tests
            suppressPassed: false,  // do not print information about passed tests
            suppressSkipped: false  // do not print information about skipped tests
        },


        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            dir: '../coverage/'
        },

        browsers: [
            'Chrome'
        ],

        // browserify configuration
        browserify: {
            files: [
                'test/**/*.spec.js'
            ],
            debug: true,
            transform: [
                ['browserify-ng-html2js', {
                    module: 'templates',
                    extension: 'html'
                }],
                'browserify-istanbul',
                'brfs',
                'browserify-shim'
            ]
        }
    });
};
