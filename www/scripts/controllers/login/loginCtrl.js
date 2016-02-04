/*global define */
define(['angular'], function(angular) {

    angular.module('salesAudit.login', [])
    .controller('LoginCtrl', ['$scope', function($scope) {

        $scope.mockLoginData = {
            userName: 'joeM',
            passWord: 'admin'
        };
        $scope.mockHeaderLabel = "This is a mock header label.";
        $scope.errorMessage = "Login information is incorrect.";
    }]);

});
