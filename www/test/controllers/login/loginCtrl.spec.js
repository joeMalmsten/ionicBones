/* global require describe beforeEach inject it expect*/
require('../../../src/controllers/login/loginCtrl');

describe('LoginCtrl', function() {
    var $controller;

    beforeEach(angular.mock.module('RAS.login'));
    beforeEach(inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    it('Exists', function() {
        var $scope = {};
        var controller = $controller('LoginCtrl', {$scope: $scope});
        expect(controller).toBeDefined();
    });

    describe('$scope.submitLogin', function() {
        var $scope,
            controller;
        beforeEach(function() {
            $scope = {};
            controller = $controller('LoginCtrl', {$scope: $scope});
        });

        it('will display an error message if there is an invalid username', function() {
            // Given
            $scope.inputValues.username = 'notCorrect';
            $scope.inputValues.password = 'admin';

            // When
            $scope.submitLogin();

            //Then
            expect($scope.displayErrorMessage).toBeTruthy();
        });

        it('will display an error message if there is an invalid password', function() {
            // Given
            $scope.inputValues.username = 'joeM';
            $scope.inputValues.password = 'notCorrect';

            // When
            $scope.submitLogin();

            //Then
            expect($scope.displayErrorMessage).toBeTruthy();
        });

        it('will display an error message if both fields are invalid', function() {
            // Given
            $scope.inputValues.username = 'notCorrect';
            $scope.inputValues.password = 'notCorrect';

            // When
            $scope.submitLogin();

            //Then
            expect($scope.displayErrorMessage).toBeTruthy();
        });

        it('will not display an error message if there is good credentials', function() {
            // Given
            $scope.inputValues.username = 'joeM';
            $scope.inputValues.password = 'admin';

            // When
            $scope.submitLogin();

            //Then
            expect($scope.displayErrorMessage).not.toBeTruthy();
        });
    });
});
