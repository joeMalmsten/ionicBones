/*global angular require*/
require('./appHeader.html');

/**
 * Contains the header for our app
 *
 * Dependencies: templates(third party)
 *
 * @module app.hotkeys
 */
angular.module('app.header', ['templates'])
/**
 * A controller that contains the main logic for the app header
 *
 * @class NavbarCtrl
 * @param {Object} $scope
 *  The isolate scope of the directive.
 * @param {Object} $state
 *  Ionics router, used to change to a new page
 */
.controller('NavbarCtrl', ['$scope', '$state', function($scope, $state) {
    var self = this;
    self.isLoggedIn = false;
    $scope.mockLabel = 'app header';
    $scope.userName = 'Test User';

    /**
     * Redirects to dashboard if logged in, goes to login page otherwise
     *
     * @method $scope.redirectToDashboard
     * @return none
     */
    $scope.redirectToDashboard = function() {
        if (self.isLoggedIn) {
            $state.go('dashboard');
        } else {
            $state.go('login');
        }
    };
}])
/**
 * A directive that contains the main logic for using the appHeader in html
 *
 * @class appHeader
 */
.directive('appHeader', [function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'appHeader.html',
        controller: 'NavbarCtrl',
        scope: {
            placeholder: '@',
            inputObject: '=',
            submitFunc: '&'
        }
    };
}]);
