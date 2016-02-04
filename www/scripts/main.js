/*global require */
require.config({
    paths: {
        'angular': '../lib/ionic/js/angular/angular',
        'ionic': '../lib/ionic/js/ionic',

        'angularIonic': '../lib/ionic/js/ionic-angular',
        'angularUiRouter': '../lib/ionic/js/angular-ui/angular-ui-router',
        'angularSanitize': '../lib/ionic/js/angular/angular-sanitize',
        'angularAnimate': '../lib/ionic/js/angular/angular-animate'

    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angularAnimate': {
            deps: ['angular']
        },
        'angularSanitize': {
            deps: ['angular']
        },
        'angularUiRouter': {
            deps: ['angular']
        },
        'ionic': {
            deps: ['angular'],
            exports: 'ionic'
        },
        'angularIonic': {
            deps: [
                'angular',
                'ionic',
                'angularUiRouter',
                'angularAnimate',
                'angularSanitize'
            ]
        }
    },
    priority: [
        'angular',
        'ionic'
    ],
    deps: [
        'bootstrap'
    ]
});

require([
    'angular',
    'app'
],
function (angular, app) {
    var onDeviceReady = function () {
        angular.bootstrap(document, [app.name]);

    };
    document.addEventListener('deviceready', onDeviceReady);
});
