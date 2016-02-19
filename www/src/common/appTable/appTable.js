/*global angular require*/
'use strict';
var safeApply = require("../safeApply/safeApply");

require('../../../../node_modules/angular-hotkeys/build/hotkeys');
require('../appBindHtmlCompile/appBindHtmlCompile');
require("./appTable.html");

angular.module('app.table', ['templates', 'app.bindHtmlCompile', 'cfp.hotkeys'])
.controller('TableCtrl', ['$scope', 'hotkeys', function($scope, hotkeys) {
    var $ = require('jquery'),
        self = this,
        documentElem = $(document);

    self.initHotkeys = function() {
        hotkeys.bindTo($scope)
        .add({
            combo: 'shift',
            description: 'tells the controller that the shift key has been pressed',
            callback: function() {
                self.shiftKey = true;
                documentElem.on('keyup', function(event) {
                    if (event.which === 16) {
                        self.shiftKey = false;
                        documentElem.off('keyup');
                    }
                });
            }
        });
    };
}])
.directive('appTable', ['$timeout', 'hotkeys', function($timeout, hotkeys) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "appTable.html",
        controller: "TableCtrl",
        scope: {
            tableData: "=",
            tableColumns: "=",
            availableOptions: "="
        },
        link: function($scope, $element, $attr, $ctrl) {
            var _ = require("lodash");
            // Needed for predicates with white space, angulare requires
            //  single spaces to parse them properly

            function sanitizePredicate(predicate, reverse) {
                var ret = "'";

                if (reverse) {
                    ret = "-" + ret;
                }

                ret += predicate.replace(["'", "-"], "") + "'";

                return ret;
            }

            $scope.isSortingBy = function(col) {
                var sanitizedCol = sanitizePredicate(col),
                    sanitizedReverseCol = sanitizePredicate(col, true),
                    ret = 0;

                _.each($scope.predicate, function(value) {
                    if (value === sanitizedCol) {
                        ret = 1;

                        // return false will break from lofash foreach
                        return false;
                    } else if (value === sanitizedReverseCol) {
                        ret = -1;

                        return false;
                    }
                });

                return ret;
            };

            $scope.sortTableBy = function(predicate) {
                var currIndex        = $scope.predicate.indexOf(sanitizePredicate(predicate)),
                    currReverseIndex = $scope.predicate.indexOf(sanitizePredicate(predicate, true)),
                    reverse = true;

                if (currIndex === -1 && currReverseIndex !== -1) {
                    currIndex = currReverseIndex;
                    reverse = false;
                }

                if (currIndex !== -1 && $ctrl.shiftKey) {
                    if ($scope.predicate.length > 1) {
                        $scope.predicate.splice(currIndex, 1);
                    } else {
                        $scope.predicate[currIndex] = sanitizePredicate(predicate, reverse);
                    }
                } else if (currIndex !== -1 && !$ctrl.shiftKey) {
                    $scope.predicate[currIndex] = sanitizePredicate(predicate, reverse);
                } else if (currIndex === -1 && $ctrl.shiftKey) {
                    $scope.predicate.push(sanitizePredicate(predicate));
                } else {
                    $scope.predicate = [sanitizePredicate(predicate)];
                }

                safeApply($scope);
            };

            if (!$scope.tableColumns || !Array.isArray($scope.tableColumns)) {
                $scope.tableColumns = [];
                _.each($scope.tableData[0], function(value, key) {
                    $scope.tableColumns.push(key);
                });
            }

            $timeout(function() {
                $ctrl.initHotkeys();

                $scope.predicate = [sanitizePredicate($scope.tableColumns[0]), sanitizePredicate($scope.tableColumns[2])];
                $scope.reverse = true;
            }, 0);
        }
    };
}]);
