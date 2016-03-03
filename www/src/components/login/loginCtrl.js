/*global angular module require*/

// Put all var declarations on top, hoisting does this anyway
var loginModule;

require('../../common/appInput/appInput');

/**
 * module contains the logic custom inputs
 *
 * Dependencies: app.input
 *
 * @module app.login
 * @main
 */
loginModule = angular.module('app.login', ['app.input'])

/**
 * A controller that contains the main logic for the login page.
 *
 * @class LoginCtrl
 * @param {Object} $scope
 *  The isolate scope of the directive.
 * @param {Object} $state
 *  Ionic wrapper around the Angular page router
 * @param {Object} $timeout
 *  An Angular wrapper around SetTimeout
 */
.controller('LoginCtrl', ['$scope', '$state', '$timeout', function($scope, $state, $timeout) {
    // This is only needed for possible callbacks, but I still
    //  prefer to set it for consistency whenever I need to use 'this'
    var self = this,
        $    = require('jquery'),
        _    = require('lodash');

    self.mockLoginData = {
        username: 'admin',
        password: 'password'
    };

    $scope.mockLabel = 'This is a mock label.';
    $scope.errorMessage = 'Login information is incorrect.';
    $scope.displayErrorMessage = false;
    $scope.inputValues = {
        username: {
            value: ''
        },
        password: {
            value: ''
        }
    };

    /**
     * submits and attempts to validate a login, no back-end yet
     *
     * @method $scope.submitLogin
     * @return none
     */
    $scope.submitLogin = function() {
        if ($scope.canSubmit()) {
            if (self.mockLoginData.username === $scope.inputValues.username.value &&
                self.mockLoginData.password === $scope.inputValues.password.value) {
                $scope.displayErrorMessage = false;
                self.inputElems.removeClass('contains-errors');
                $state.go('dashboard');
            } else {
                $scope.displayErrorMessage = true;
                self.inputElems.addClass('contains-errors');
            }
        }
    };

    /**
     * Tells the user whether or not that have enough information to submit for
     * login
     *
     * @method $scope.canSubmit
     * @return {Boolean} whether we can submit or not
     */
    $scope.canSubmit = function() {
        var success = true;
        _.each($scope.inputValues, function(property) {
            if (!property.value) {
                success = false;
            }
        });
        return success;
    };

    /**
     * creates any necessary jquery selectors, always run AFTER angular finishes
     * rendering. This is the reason for the timeout(func(){}, 0)
     *
     * @method initSelectors
     */
    function initSelectors() {
        self.inputElems = $('.login-page-input');
    }


    // Timeout to make sure any DOM element selector functions are called after
    //  the DOM has finished rendering elements on the browser. $timeout @ 0
    //  will put these function calls at the end of the browser event queue
    $timeout(function() {
        initSelectors();
    }, 0);
}]);

module.exports = loginModule;
