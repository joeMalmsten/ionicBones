/* global require describe beforeEach inject it expect angular*/
require('../../../src/common/appBindHtmlCompile/appBindHtmlCompile');

describe('appBindHtmlCompile', function() {
    var $ = require('jquery'),
        _ = require('lodash'),
        $compile,
        $rootScope,
        directiveElem,
        mockDirectiveString = '<div app-bind-html-compile="mockHtml"></div>',
        mockHtml = '<div class="mock-repeater"' +
                       'ng-repeat="number in [3, 6, 9, 12, 15] track by $index">{{number}}' +
                    '</div>',
        element = angular.element(mockDirectiveString),
        scope;

    // mock the module that contains the directive we are testing
    beforeEach(function() {
        angular.mock.module('app.bindHtmlCompile');
    });

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(inject(function() {
        scope = $rootScope.$new();
        scope.mockHtml = mockHtml;

        directiveElem = $compile(element)(scope);
        scope.$digest();
    }));

    it('compiles the directive content into angular code', function() {
        // Given
        var repeaters = $(directiveElem).find('.mock-repeater');


        // Then:
        expect(repeaters.length).toBe(5);
        _.each(repeaters, function(repeater, index) {
            // 3, 6, 9, 12, 15 same as above mock data
            expect(parseInt($(repeater).html())).toBe((index + 1) * 3);
        });
    });
});
