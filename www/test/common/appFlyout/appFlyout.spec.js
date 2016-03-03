/* global require describe beforeEach inject it expect angular*/
require('../../../src/common/appFlyout/appFlyout');

describe('appFlyout', function() {
    var $ = require('jquery'),
        $compile,
        $rootScope,
        directiveElem,
        mockItems = ['one', 'two', 'three'],
        mockDirectiveOpening = '<div app-flyout ',
        mockDropdownItems    = 'items="mockItems" current-item="currentItem" ',
        mockCustomOnSelect   = 'on-select="onSelect(item)" ',
        mockDirectiveClosing = '></div>',
        scope;

    // mock the module that contains the directive we are testing
    beforeEach(function() {
        angular.mock.module('app.flyout');
    });

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    describe('basic dropdown - no on-select', function() {
        var element;

        beforeEach(inject(function() {
            element = angular.element(mockDirectiveOpening + mockDropdownItems + mockDirectiveClosing);
            scope = $rootScope.$new();
            scope.mockItems = mockItems;
            scope.currentItem = mockItems[0];

            directiveElem = $compile(element)(scope);
            scope.$digest();
        }));

        it('compiles the directive content into angular code and makes a dropdown', inject(function($timeout) {
            // Given:
            var flyout;

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            flyout = $(directiveElem).find('.flyout');

            // Then:
            expect(flyout.length).toBe(1);
        }));

        it('use the default on select function on li click if no on-select function is specified', inject(function($timeout) {
            // Given:
            var mockEvent = $.Event('click'),
                flyout,
                isolateScope;

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            isolateScope = directiveElem.isolateScope();
            flyout = $(directiveElem).find('.flyout');

            expect(isolateScope.currentItem).toMatch('one');

            // When:
            $(flyout.find('li')[1]).trigger(mockEvent);

            // Then:
            expect(flyout.length).toBe(1);
            expect(isolateScope.currentItem).toMatch('two');

        }));

        it('will gain an active state when the button element is clicked', inject(function($timeout) {
            // Given:
            var mockClick = $.Event('click'),
                directiveSelector = $(directiveElem),
                flyout;

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            flyout = directiveSelector.find('.flyout');

            // When:
            directiveSelector.trigger(mockClick);

            // Then:
            expect($(flyout).hasClass('active')).toBeTruthy();
        }));

        it("will lose it's active state on a mouseup event where the flyout is not the target", inject(function($timeout) {
            // Given:
            var mockMouseup = $.Event('mouseup'),
                mockClick = $.Event('click'),
                directiveSelector = $(directiveElem),
                flyout;

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            flyout = directiveSelector.find('.flyout');

            // When:
            directiveSelector.trigger(mockClick);
            expect($(flyout).hasClass('active')).toBeTruthy();

            $(document).trigger(mockMouseup);

            // Then:
            expect($(flyout).hasClass('active')).not.toBeTruthy();

        }));
    });

    describe('basic dropdown - custom on-select', function() {
        var element;

        beforeEach(inject(function() {
            element = angular.element(
                mockDirectiveOpening +
                mockDropdownItems +
                mockCustomOnSelect +
                mockDirectiveClosing
            );
            scope = $rootScope.$new();
            scope.mockItems = mockItems;
            scope.onSelect = function(item) {
                scope.currentItem = item + ' custom';
            };
            scope.currentItem = mockItems[0];

            directiveElem = $compile(element)(scope);
            scope.$digest();
        }));

        it('use the custom on select function on li click if on-select function is specified', inject(function($timeout) {
            // Given:
            var mockEvent = $.Event('click'),
                flyout,
                isolateScope;

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            isolateScope = directiveElem.isolateScope();
            flyout = $(directiveElem).find('.flyout');

            expect(isolateScope.currentItem).toMatch('one');

            // When:
            $(flyout.find('li')[1]).trigger(mockEvent);

            // Then:
            expect(flyout.length).toBe(1);
            expect(isolateScope.currentItem).toMatch('two custom');

        }));
    });
});
