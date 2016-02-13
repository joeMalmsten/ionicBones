// Karma configuration
// Generated on Thu Feb 04 2016 13:24:43 GMT-0800 (PST)

'use strict';

module.exports = function(karma) {
    karma.set({

        frameworks: [
            'jasmine',
            'browserify'
        ],

        // list of files / patterns to load in the browser
        files: [
            '../node_modules/angular/angular.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            'test/**/*.spec.js'

        ],

        preprocessors: {
            'test/**/*.spec.js': ['browserify']
        },

        // list of files to exclude
        exclude: [
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        // optionally, configure the reporter
        coverageReporter: {
            type: 'html',
            dir: '../coverage/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        browsers: [
            'Chrome'
        ],

        logLevel: karma.LOG_DEBUG,

        singleRun: true,
        autoWatch: false,

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
