/*global angular require*/
var safeApply = require("../../common/safeApply/safeApply");
require("./bonesInput.html");

angular.module('bones.input', ['templates'])
.controller('InputCtrl', ['$scope', '$timeout', '$element', function($scope, $timeout, $element) {
    var self = this;
    self.handleKeyUp = function(event) {
        if (event.which === 13 && $scope.submitFunc) {
            $scope.submitFunc();
        } else if (event.which === 27) {
            $scope.inputObject.value = "";
            safeApply($scope);
        }
    };

    $timeout(function() {
        self.inputElem = $($element);

        self.inputElem.keyup(self.handleKeyUp);
    }, 0);

}])
.directive('bonesInput', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "bonesInput.html",
        controller: "InputCtrl",
        scope: {
            placeholder: '@',
            inputObject: "=",
            submitFunc: '&'
        }
    };
}]);
