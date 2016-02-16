/*global angular require*/
require("./bonesNavBar.html");

angular.module('bones.navbar', ['templates'])
.controller('NavbarCtrl', ['$scope', '$state', function($scope, $state) {
    var self = this;
    self.isLoggedIn = false;
    $scope.mockLabel = "bones | Ionic Browserify";

    $scope.redirectToDashboard = function() {
        if (self.isLoggedIn) {
            $state.go('dashboard');
        } else {
            $state.go('login');
        }
    };
}])
.directive('bonesNavBar', [function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "bonesNavBar.html",
        controller: "NavbarCtrl",
        scope: {
            placeholder: '@',
            inputObject: "=",
            submitFunc: '&'
        }
    };
}]);
