/*global angular require*/
require("./appHeader.html");

angular.module('app.header', ['templates'])
.controller('NavbarCtrl', ['$scope', '$state', function($scope, $state) {
    var self = this;
    self.isLoggedIn = false;
    $scope.mockLabel = "app header";
    $scope.userName = "Test User";

    $scope.redirectToDashboard = function() {
        if (self.isLoggedIn) {
            $state.go('dashboard');
        } else {
            $state.go('login');
        }
    };
}])
.directive('appHeader', [function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "appHeader.html",
        controller: "NavbarCtrl",
        scope: {
            placeholder: '@',
            inputObject: "=",
            submitFunc: '&'
        }
    };
}]);
