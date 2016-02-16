/* global require describe beforeEach inject it expect angular spyOn*/
require('../../../src/components/bonesNavBar/bonesNavBar.js');

describe('bonesNavBar', function() {
    var $compile,
        $rootScope,
        mockDirectiveString = "<bones-nav-bar></bones-nav-bar>",
        element = angular.element(mockDirectiveString),
        directiveElem,
        directiveCtrl,
        scope,
        mockStateProvider = require("../../data/mockStateProvider");

    // mock the module that contains the directive we are testing, and the
    //   templates module if the directive we are testing takes a template
    beforeEach(function() {
        angular.mock.module('templates');
        angular.mock.module('bones.navbar', function($provide) {
            $provide.value('$state', mockStateProvider);
        });
    });

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function() {
        scope = $rootScope.$new();

        directiveElem = $compile(element)(scope);
        scope.$digest();
        directiveCtrl = element.controller('bonesNavBar');
    });

    it('Replaces the element with the appropriate content', function() {
        expect($(directiveElem).find(".icon.logo").length).toEqual(1);
    });

    describe("bonesNavBar redirect button", function() {

        it ("will redirect to login if it does not think we're logged in", function() {
            // Given:
            spyOn(mockStateProvider, 'go');

            // When:
            $(directiveElem).find(".icon.logo").first().click();

            expect(mockStateProvider.go).toHaveBeenCalledWith('login');
            expect(mockStateProvider.go.calls.count()).toEqual(1);
        });

        it ("will redirect to dashboard if it thinks we're logged in", function() {
            // Given:
            directiveCtrl.isLoggedIn = true;
            spyOn(mockStateProvider, 'go');

            // When:
            $(directiveElem).find(".icon.logo").first().click();

            expect(mockStateProvider.go).toHaveBeenCalledWith('dashboard');
            expect(mockStateProvider.go.calls.count()).toEqual(1);
        });
    });
});
