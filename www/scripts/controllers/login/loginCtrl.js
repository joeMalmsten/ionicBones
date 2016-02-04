/*global define */
define(['angular'], function(angular) {

    angular.module('salesAudit.login', [])
    .controller('LoginCtrl', ['$scope', function($scope) {
        // This is only needed for possible callbacks, but I still
        //  prefer to set it for consistency whenever I need to use 'this'
        var self = this;

        /**
         * Note: Make any variables we might want to unit test a self.varialble.
         *        using var variable makes the variable private to jasmine and
         *        you don't want private variables tested
         */
        self.mockLoginData = {
            userName: 'joeM',
            password: 'admin'
        };

        $scope.mockHeaderLabel = "This is a mock header label.";
        $scope.errorMessage = "Login information is incorrect.";
        $scope.displayErrorMessage = false;
        $scope.inputValues = {
            userName: "",
            password: ""
        };

        $scope.submitLogin = function() {
            if (self.mockLoginData.userName === $scope.inputValues.userName &&
                self.mockLoginData.password === $scope.inputValues.password) {
                console.log("login info matches. Success");
                $scope.displayErrorMessage = false;
            } else {
                $scope.displayErrorMessage = true;
            }
        };
    }]);

});
