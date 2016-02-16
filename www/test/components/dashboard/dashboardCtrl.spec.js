/* global require describe beforeEach inject it expect angular*/
require('../../../src/components/dashboard/dashboardCtrl');

describe('DashboardCtrl', function() {
    var $controller;

    beforeEach(angular.mock.module('bones.dashboard'));
    beforeEach(inject(function(_$controller_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));

    it('Exists', inject(function($timeout) {
        var $scope = {};
        var controller = $controller('DashboardCtrl', {$scope: $scope});

        expect(controller).toBeDefined();
    }));
});
