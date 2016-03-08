/*global angular require*/
'use strict';

var safeApply = require('../../common/safeApply/safeApply');
require('./appInput.html');

/**
 * module contains the logic custom inputs
 *
 * Dependencies: templates(third party)
 *
 * @module app.input
 * @main
 */
angular.module('app.input', ['templates'])

/**
 * A controller that contains the main logic for the appInput directive.
 *
 * @class InputCtrl
 * @param {Object} $scope
 *  The isolate scope of the directive.
 * @param {Object} $element
 *  The compiled directive element.
 * @param {Object} $timeout
 *  An Angular wrapper around SetTimeout
 */
.controller('InputCtrl', ['$scope', '$element', '$timeout', function($scope, $element, $timeout) {
    var self = this;

    /**
     * Handles any special input, e.g. enter or escape on the input
     *
     * @method self.handleKeyUp
     * @param {Object} event
     *  The keyup event that was fired to call this function.
     * @return none
     */
    self.handleKeyUp = function(event) {
        if (event.which === 13 && $scope.submitFunc) {
            $scope.submitFunc();
        } else if (event.which === 27) {
            $scope.clearInput();
        }
    };

    /**
     * Clears input value when called
     *
     * @method $scope.clearInput
     * @return none
     */
    $scope.clearInput = function() {
        $scope.inputObject.value = '';
        safeApply($scope);
    };

    $timeout(function() {
        self.inputElem = $($element);

        self.inputElem.keyup(self.handleKeyUp);
    }, 0);

}])

/**
 * A directive that uses the InputCtrl controller to handle creating inputs from
 * html in angular.
 *
 * @class appInput
 */
.directive('appInput', [function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'appInput.html',
        controller: 'InputCtrl',
        scope: {
            inputObject: '=',
            placeholder: '@?',
            readonly: '=?',
            transparent: '=?',
            submitFunc: '&?',
            customClass: '@?',
            inputType: '@?',
            prefix: '@?'
        }
    };
}]);
