/* global require describe beforeEach inject it expect angular*/
require('../../../src/common/bonesInput/bonesInput.js');

describe('bonesInput', function() {
    var $compile,
        $rootScope,
        $httpBackend;

    // mock the module that contains the directive we are testing, and the
    //   templates module if the directive we are testing takes a template
    beforeEach(function() {
        angular.mock.module('templates');
        angular.mock.module('ionicBones.input');
    });

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Replaces the element with the appropriate content', function() {
        var element;

        // Compile a piece of HTML containing the directive
        element = $compile("<bones-input></bones-input>")($rootScope);

        // fire all the watches, so the scope expression {{1 + 1}} will be evaluated
        $rootScope.$digest();

        // Check that the compiled element contains the templated content
        // TODO: Write this unit test now that we have templates working.
        console.log(element);
        expect(1).toBe(1);
    });
});
