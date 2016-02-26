/*global angular require*/
'use strict';

var safeApply = require("../../common/safeApply/safeApply");
require("./appInput.html");

angular.module('app.input', ['templates'])
.controller('InputCtrl', ['$scope', '$timeout', '$element', function($scope, $timeout, $element) {
    var self = this;
    self.handleKeyUp = function(event) {
        if (event.which === 13 && $scope.submitFunc) {
            $scope.submitFunc();
        } else if (event.which === 27) {
            $scope.clearInput();
        }
    };

    $scope.clearInput = function() {
        $scope.inputObject.value = "";
    };

    $timeout(function() {
        self.inputElem = $($element);

        self.inputElem.keyup(self.handleKeyUp);
    }, 0);

}])
.directive('appInput', [function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "appInput.html",
        controller: "InputCtrl",
        scope: {
            inputObject: "=",
            placeholder: '@?',
            readonly: '=?',
            transparent: '=?',
            submitFunc: '&?',
            customClass: '@?',
            prefix: "@?"
        }
    };
}]);
