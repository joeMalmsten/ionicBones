/* global require describe beforeEach inject it expect angular*/
require('../../../src/common/bonesInput/bonesInput.js');

describe('bonesInput', function() {
    var $compile,
        $rootScope,
        mockPlaceholder = "mockPlaceholder",
        mockInputObject = {
            value: ""
        },
        hitSubmitFunc = false,
        mockString = "this is some fake data",
        mockSubmitFunction = function() {
            hitSubmitFunc = true;
        },
        mockDirectiveString = "<bones-input " +
                                  "placeholder='mockPlaceholder' " +
                                  "input-object='mockInputObject' " +
                                  "submit-func='mockSubmitFunction()'>" +
                              "</bones-input>",
        element = angular.element(mockDirectiveString),
        directiveElem,
        scope,
        isolateScope,

        // Unused but keeping for future example reference on pulling
        //  a controller from a directive.
        directiveCtrl;

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

    beforeEach(inject(function($timeout) {
        scope = $rootScope.$new();
        scope.mockPlaceholder = mockPlaceholder;
        scope.mockSubmitFunction = mockSubmitFunction;
        scope.mockInputObject = mockInputObject;
        scope.mockInputObject.value = mockString;

        directiveElem = $compile(element)(scope);
        scope.$digest();

        // flush timeout(s) for all code under test.
        $timeout.flush();

        // this will throw an exception if there are any pending timeouts.
        $timeout.verifyNoPendingTasks();

        // The controller can only be pulled out of the corresponding angular
        //  I set element above.
        directiveCtrl = element.controller("bonesInput");
        isolateScope = directiveElem.isolateScope();
    }));

    it('Replaces the element with the appropriate content', function() {
        expect(element.attr('placeholder')).toMatch(mockPlaceholder);
        expect(mockInputObject).toEqual(isolateScope.inputObject);
        expect(typeof isolateScope.submitFunc === "function").toBeTruthy();
    });

    describe("bonesInput handleKeyUp", function() {

        it ('will clear the input on getting an ecape key event', function() {
            // Given:
            var mockEvent = $.Event('keyup');
            mockEvent.which = 27;

            // Expect we have good data before we clear it.
            expect(mockInputObject.value).toMatch(mockString);

            // When:
            $(element).trigger(mockEvent);

            // Then:
            expect(mockInputObject).toEqual(isolateScope.inputObject);
            expect(mockInputObject.value).toMatch("");
        });

        it ('will submit the input on getting an enter key event', function() {
            // Given:
            var mockEvent = $.Event('keyup');
            mockEvent.which = 13;

            // expect that we haven't attempted to submit yet
            expect(hitSubmitFunc).not.toBeTruthy();

            // When:
            $(element).trigger(mockEvent);

            // Then:
            expect(mockInputObject).toEqual(isolateScope.inputObject);
        });
    });
});
