/*global angular require*/
'use strict';

require("./appFlyout.html");
require("./appDropdown.html");

//TODO: Pull flyout specific code into a service so can can create flyouts
// purely from JS without a directive.
angular.module('app.flyout', ['templates'])
.factory('flyoutFactory', [function() {
    var $ = require('jquery'),
        documentSelector = $(document),
        flyoutFactory = {
            options: {},
            positionFlyout: function(targetElem, containerElem, flyoutElem) {
                var targetOffset = targetElem.offset(),
                    containerOffset = containerElem.offset(),
                    targetLeft = targetOffset.left - containerOffset.left,
                    targetTop = targetOffset.top + parseInt(targetElem.css('height')) - containerOffset.top;

                flyoutElem.css({
                    left: targetLeft + "px",
                    top: targetTop + "px"
                });
            },
            initListeners: function(targetElem, containerElem, buttonElem, flyoutElem) {
                var self = this,
                    dontHideOnSelect = self.options.dontHideOnSelect || false;
                buttonElem.on('click', function() {
                    self.positionFlyout(targetElem, containerElem, flyoutElem);
                    buttonElem.toggleClass('active');
                    flyoutElem.toggleClass('active');

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
            create: function(flyoutElem, targetElem, containerElem, buttonElem, options) {
                this.options = options;
                this.positionFlyout(targetElem, containerElem, flyoutElem);
                this.initListeners(targetElem, containerElem, buttonElem, flyoutElem);
                containerElem.append(flyoutElem);
            }
        };

    return flyoutFactory;
}])
.controller('FlyoutCtrl', ['$scope', '$element', '$templateCache', '$compile', '$timeout', 'flyoutFactory', function($scope, $element, $templateCache, $compile, $timeout, flyoutFactory) {
    var $ = require('jquery'),
        _ = require('lodash'),
        flyoutTemplate = 'appDropdown.html',
        buttonElem = $($element),
        flyoutElem = $("<div class='flyout'></div>"),
        targetElem,
        containerElem,
        options = {};



    function defaultSelect(item) {
        console.log("Hit default on select!", item);
    }

    $scope.selectItem = function (event, item) {
        $scope.currentItem = item;
        $scope.onSelect({
            event: event,
            item: item
        });
    };

    if (!$scope.onSelect) {
        $scope.onSelect = defaultSelect;
    }

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
.directive('appFlyout', [function() {
    return {
        restrict: 'A',
        templateUrl: "appFlyout.html",
        transclude: "true",
        controller: "FlyoutCtrl",
        scope: {
            customFlyout: '@',
            onSelect: '&?',
            container: '@',
            items: '=',
            currentItem: '=?',
            dontHideOnSelect: '=?',
            options: '@'
        },
        link: function($scope) {
        }
    };
}]);
