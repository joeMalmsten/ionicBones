/*global angular module require*/
var safeApply = require("../../common/safeApply/safeApply");
require("./bonesInput.html");

angular.module('ionicBones.input', ['templates'])
.controller('InputCtrl', ['$scope', '$timeout', function($scope, $timeout) {
    // Put any controller code here, e.g. when directives need to speak
    //  with eachother
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
        },
        link: function($scope, $element) {
            var self = this;

            $timeout(function() {
                self.inputElem = $($element);

                self.inputElem.keyup(function(event) {
                    if (event.which === 13 && $scope.submitFunc) {
                        $scope.submitFunc();
                    } else if (event.which === 27) {
                        $scope.inputObject.value = "";
                        safeApply($scope);
                    }
                });
            }, 0);
        }
    };
}]);
