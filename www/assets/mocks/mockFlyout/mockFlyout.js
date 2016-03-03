/*global angular module require*/

// Put all var declarations on top, hoisting does this anyway
var mockFlyoutModule;
require('./mockFlyout.html');


mockFlyoutModule = angular.module('app.mockFlyout', [])
.controller('MockFlyoutCtrl', ['$scope', function($scope) {

    $scope.hitCtrlButton = function() {
        console.log('Hit a button inside the flyout!!!!!');
    };
}]);

module.exports = mockFlyoutModule;
