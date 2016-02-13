/*global angular module require*/

// Put all var declarations on top, hoisting does this anyway
var loginModule,
    _ = require("lodash");

require('../../common/bonesInput/bonesInput');

loginModule = angular.module('ionicBones.login', ["ionicBones.input"])
.controller('LoginCtrl', ['$scope', '$timeout', function($scope, $timeout) {
    // This is only needed for possible callbacks, but I still
    //  prefer to set it for consistency whenever I need to use 'this'
    var self = this,
        $    = require('jquery');

    /**
     * Note: Make any variables we might want to unit test a self.varialble.
     *        using var variable makes the variable private to jasmine and
     *        you don't want private variables tested
     */
    self.mockLoginData = {
        username: 'joeM',
        password: 'admin'
    };

    $scope.mockHeaderLabel = "This is a mock label.";
    $scope.errorMessage = "Login information is incorrect.";
    $scope.displayErrorMessage = false;
    $scope.inputValues = {
        username: {
            value: ''
        },
        password: {
            value: ''
        }
    };

    $scope.submitLogin = function() {
        if (self.mockLoginData.username === $scope.inputValues.username.value &&
            self.mockLoginData.password === $scope.inputValues.password.value) {
            $scope.displayErrorMessage = false;
            self.inputElems.removeClass('contains-errors');
        } else {
            $scope.displayErrorMessage = true;
            self.inputElems.addClass('contains-errors');
        }
    };

    $scope.canSubmit = function() {
        var success = true;
        _.each($scope.inputValues, function(property, key) {
            if (!property.value) {
                success = false;
            }
        });
        return success;
    };

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
