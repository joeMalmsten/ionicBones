/* global require describe beforeEach inject it expect angular*/
require('../../../src/components/login/loginCtrl');

describe('LoginCtrl', function() {
    var $controller,
        mockStateProvider = require("../../data/mockStateProvider");

    beforeEach(angular.mock.module('app.login', function($provide) {
        $provide.value('$state', mockStateProvider);
    }));

    beforeEach(inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    it('Exists', inject(function($timeout) {
        var $scope = {};
        var controller = $controller('LoginCtrl', {$scope: $scope});

        // flush timeout(s) for all code under test.
        $timeout.flush();

        // this will throw an exception if there are any pending timeouts.
        $timeout.verifyNoPendingTasks();

        expect(controller).toBeDefined();
    }));

    describe('$scope.canSubmit', function() {
        var $scope;
        beforeEach(function() {
            $scope = {};
            $controller('LoginCtrl', {$scope: $scope});
        });

        it ("return false if there is no username set", function() {
            // Given
            $scope.inputValues.username.value = '';
            $scope.inputValues.password.value = 'password';

            // When
            //Then
            expect($scope.canSubmit()).not.toBeTruthy();
        });

        it ("return false if there is no password set", function() {
            // Given
            $scope.inputValues.username.value = 'admin';
            $scope.inputValues.password.value = '';

            // When
            //Then
            expect($scope.canSubmit()).not.toBeTruthy();
        });

        it ("return true if both fields are sett", function() {
            // Given
            $scope.inputValues.username.value = 'admin';
            $scope.inputValues.password.value = 'password';

            // When
            //Then
            expect($scope.canSubmit()).toBeTruthy();
        });
    });

    describe('$scope.submitLogin', function() {
        var $scope,
            controller;
        beforeEach(function() {
            $scope = {};
            controller = $controller('LoginCtrl', {$scope: $scope});
            controller.inputElems = {
                addClass: function(className) {
                    this.className = className;
                },
                removeClass: function(className) {
                    this.className.replace("/" + className + "/g", "");
                },
                className: ""
            };
        });

        it('will display an error message if there is an invalid username', function() {
            // Given
            $scope.inputValues.username.value = 'notCorrect';
            $scope.inputValues.password.value = 'password';

            // When
            $scope.submitLogin();

            //Then
            expect($scope.displayErrorMessage).toBeTruthy();
        });

        it('will display an error message if there is an invalid password', function() {
            // Given
            $scope.inputValues.username.value = 'admin';
            $scope.inputValues.password.value = 'notCorrect';

            // When
            $scope.submitLogin();

            //Then
            expect($scope.displayErrorMessage).toBeTruthy();
        });

        it('will display an error message if both fields are invalid', function() {
            // Given
            $scope.inputValues.username.value = 'notCorrect';
            $scope.inputValues.password.value = 'notCorrect';

            // When
            $scope.submitLogin();

            //Then
            expect($scope.displayErrorMessage).toBeTruthy();
        });

        it('will not display an error message if there is good credentials', function() {
            // Given
            $scope.inputValues.username.value = 'admin';
            $scope.inputValues.password.value = 'password';

            // When
            $scope.submitLogin();

            //Then
            expect($scope.displayErrorMessage).not.toBeTruthy();
        });
    });
});
