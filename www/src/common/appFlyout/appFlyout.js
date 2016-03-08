/*global angular require*/
'use strict';

require('./appFlyout.html');
require('./appDropdown.html');

/**
 * module contains the logic for modals, popups, and dropdowns. (flyouts)
 *
 * Dependencies: templates(third party)
 *
 * @module app.flyout
 * @main
 */
angular.module('app.flyout', ['templates'])

/**
 * A factory than contains the logic to create flyouts in js.
 *
 * @class flyoutFactory
 * @constructor
 */
.factory('flyoutFactory', [function() {
    var $ = require('jquery'),
        documentSelector = $(document),
        flyoutFactory = {
            options: {},

            /**
             * Positions the flyoutElem based on the container and target elems.
             *
             * @method positionFlyout
             * @param {Object} targetElem
             *  The target element, the flyout will be placed below this element.
             * @param {Object} containerElem
             *  The element in the dom the flyout will be appended to,
             * positioning needs to take container offset into account.
             * @param {Object} flyoutElem
             *  The flyout element being positioned.
             * @return none
             */
            positionFlyout: function(targetElem, containerElem, flyoutElem) {
                var targetOffset = targetElem.offset(),
                    containerOffset = containerElem.offset(),
                    targetLeft = targetOffset.left - containerOffset.left,
                    targetTop = targetOffset.top + parseInt(targetElem.css('height')) - containerOffset.top;

                flyoutElem.css({
                    left: targetLeft + 'px',
                    top: targetTop + 'px'
                });
            },

            /**
             * Initializes all event listeners needed for the flyout.
             *
             * @method positionFlyout
             * @param {Object} targetElem
             *  The target element, the flyout will be placed below this element.
             * @param {Object} containerElem
             *  The element in the dom the flyout will be appended to,
             * positioning needs to take container offset into account.
             * @param {Object} buttonElem
             *  The element what when clicked will toggle the display of the
             * flyout.
             * @param {Object} flyoutElem
             *  The flyout element being positioned.
             * @return none
             */
            initListeners: function(targetElem, containerElem, buttonElem, flyoutElem) {
                var self = this,
                    dontHideOnSelect = self.options.dontHideOnSelect || false;
                buttonElem.on('click', function(e) {
                    self.positionFlyout(targetElem, containerElem, flyoutElem);
                    if ((!flyoutElem.is(e.target) && flyoutElem.has(e.target).length === 0)) {
                        buttonElem.toggleClass('active');
                        flyoutElem.toggleClass('active');
                    }

                    if (flyoutElem.hasClass('active')) {
                        // Hide the flyout when we click any element other than it
                        documentSelector.on('mouseup', function(e) {
                            if (!dontHideOnSelect || (!flyoutElem.is(e.target) && flyoutElem.has(e.target).length === 0)) {
                                buttonElem.removeClass('active');
                                flyoutElem.removeClass('active');
                                documentSelector.off('mouseup');
                            }
                        });
                    }
                });
            },

            /**
             * Initializes all event listeners needed for the flyout.
             *
             * @method positionFlyout
             * @param {Object} flyoutElem
             *  The flyout element being positioned.
             * @param {Object} targetElem
             *  The target element, the flyout will be placed below this element.
             * @param {Object} containerElem
             *  The element in the dom the flyout will be appended to,
             * positioning needs to take container offset into account.
             * @param {Object} buttonElem
             *  The element what when clicked will toggle the display of the
             * flyout.
             * @param {Object} [options]
             *  An object containing custom options.
             * @return none
             */
            create: function(flyoutElem, targetElem, containerElem, buttonElem, options) {
                this.options = options;
                this.positionFlyout(targetElem, containerElem, flyoutElem);
                this.initListeners(targetElem, containerElem, buttonElem, flyoutElem);
                containerElem.append(flyoutElem);
            }
        };

    return flyoutFactory;
}])

/**
 * A controller that contains the main logic for the flyout directive.
 *
 * @class FlyoutCtrl
 * @param {Object} $scope
 *  The isolate scope of the directive.
 * @param {Object} $element
 *  The compiled directive element.
 * @param {Object} $templateCache
 *  Contains all html templates that are stored in the 'templates' module.
 * @param {Object} $compile
 *  Compiles any angular code in a given html string.
 * @param {Object} $timeout
 *  An Angular wrapper around SetTimeout
 * @param {Object} flyoutFactory
 *  An instantiation of the above factory class. Creates and positions flyout
 */
.controller('FlyoutCtrl', ['$scope', '$element', '$templateCache', '$compile', '$timeout', 'flyoutFactory', function($scope, $element, $templateCache, $compile, $timeout, flyoutFactory) {
    var $ = require('jquery'),
        _ = require('lodash'),
        flyoutTemplate = 'appDropdown.html',
        buttonElem = $($element),
        flyoutElem = $("<div class='flyout'></div>"),
        targetElem,
        containerElem,
        options = {};

    /**
     * Sets the currently selected item and calls a custom onSelect function if
     * defined.
     *
     * @method $scope.selectItem
     * @param {Object} event
     *  The event that was fired to call this function, usually 'click'.
     * @param {Object} item
     *  The item that was selected during the event.
     * @return none
     */
    $scope.selectItem = function (event, item) {
        $scope.currentItem = item;
        if ($scope.onSelect) {
            $scope.onSelect({
                'item': item
            });
        }
    };

    if ($scope.dontHideOnSelect) {
        options.dontHideOnSelect = $scope.dontHideOnSelect;
    }

    if ($scope.options) {
        _.extend(options, $scope.options);
    }

    if ($scope.customFlyout) {
        flyoutTemplate = $scope.customFlyout;
    }
    flyoutTemplate = $templateCache.get(flyoutTemplate);
    flyoutElem.append($compile(flyoutTemplate)($scope));

    if ($scope.container) {
        containerElem = $($scope.container);
    } else {
        containerElem = $($element);
    }

    if ($scope.targetElemSelector) {
        targetElem = $($scope.targetElemSelector);
    } else {
        targetElem = buttonElem;
    }

    $timeout(function() {
        flyoutFactory.create(flyoutElem, targetElem, containerElem, buttonElem, options);
    }, 0);
}])

/**
 * A directive that uses the FlyoutCtrl controller to handle creating any
 * flyouts from html in angular.
 *
 * @class appFlyout
 */
.directive('appFlyout', [function() {
    return {
        restrict: 'A',
        templateUrl: 'appFlyout.html',
        transclude: 'true',
        controller: 'FlyoutCtrl',
        scope: {
            customFlyout: '@',
            onSelect: '&?',
            container: '@',
            items: '=',
            currentItem: '=',
            dontHideOnSelect: '=?',
            options: '@'
        }
    };
}]);
