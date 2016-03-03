/*global angular require*/
'use strict';
var safeApply = require('../safeApply/safeApply');

require('../appBindHtmlCompile/appBindHtmlCompile');
require('../appFlyout/appFlyout');
require('../../../lib/smoothscroll.min');
require('../appFilters/appFilters');
require('../hotkeys/hotkeys');
require('./appTable.html');

/**
 * module contains the logic for generating tables.
 *
 * Dependencies: templates(third party), app.bindHtmlCompile, app.input, app.flyout,
 * app.filters, app.hotkeys
 *
 * @module app.table
 * @main
 */
angular.module('app.table', ['templates', 'app.bindHtmlCompile', 'app.input', 'app.flyout', 'app.filters', 'app.hotkeys'])
/**
 * A controller that contains the main logic for the table directive.
 *
 * @class TableCtrl
 */
.controller('TableCtrl', [function() {
}])
/**
 * A directive that contains the main logic for creating tables.
 *
 * @class appTable
 * @param {Object} $timeout
 *  Angular wrapper around SetTimeout
 * @param {Object} filterFilter
 *  angular filter for filtering ng-repeat. Slow and we should remove ng-repeat
 * @param {Object} hotkeysFactory
 *  Instantiation of the hotkey factory that manages all of our apps keybindings
 */
.directive('appTable', ['$timeout', 'filterFilter', 'hotkeysFactory', function($timeout, filterFilter, hotkeysFactory) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'appTable.html',
        controller: 'TableCtrl',
        scope: {
            tableConfig: '=',
            selectablePageSize: '=?',
            pagingType: '@'
        },
        /**
         * Initializes the table, put logic here instead of in the controller
         *
         * @method link
         * @param {Object} scope
         *  The isolate scope of the directive
         * @param {Object} element
         *  The compiled element of the directive
         * @return none
         */
        link: function(scope, element) {
            var _ = require('lodash'),
                filterInputElem,
                filterColumnElem,
                elem = $(element),
                tbody,
                thead,
                theadCols,
                trows,
                tcols = {},
                rowHeight,
                visibleStartRowMargin = 0.85,
                visibleEndRowMargin = 0.3,
                scrollbarWidth;

            /**
             * Sanitizes sorting predicates to be used with angular.
             *
             * @method sanitizePredicate
             * @param {String} predicate
             *  The name of the predicate we want to use for sorting.
             * @param {Boolean} reverse
             *  Whether or not we are sorting in Asc or Desc order.
             * @return {String} Sanitized predicate.
             */
            function sanitizePredicate(predicate, reverse) {
                var ret = "'";

                if (reverse) {
                    ret = '-' + ret;
                }

                ret += predicate.replace(["'", '-'], '') + "'";

                return ret;
            }

            /**
             * Inits keybindings for table when table is made, creates event
             * to destroy keybindings when table no longer exists
             *
             * @method initHotkeys
             * @return none
             */
            function initHotkeys() {
                var offFunction;
                hotkeysFactory.bind('shift', scope);

                offFunction = scope.$on('$destroy', function() {
                    hotkeysFactory.unbind('shift');
                    offFunction();
                });
            }

            /**
             * The width of the scrollbar needs to be taken into account when
             * resizing the scrollable table. Scrollbar width changes on OS and
             * browser so we need to create a scrollbar, get its' width and then
             * destroy it
             *
             * @method getScrollbarWidth
             * @return the width of a scroll bar on the users OS/Browser
             */
            function getScrollbarWidth() {
                var outer = document.createElement('div');
                outer.style.visibility = 'hidden';
                outer.style.width = '100px';
                outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

                document.body.appendChild(outer);

                var widthNoScroll = outer.offsetWidth;
                // force scrollbars
                outer.style.overflow = 'scroll';

                // add innerdiv
                var inner = document.createElement('div');
                inner.style.width = '100%';
                outer.appendChild(inner);

                var widthWithScroll = inner.offsetWidth;

                // remove divs
                outer.parentNode.removeChild(outer);

                return widthNoScroll - widthWithScroll;
            }

            /**
             * Resizes the column widths to make the scrollable table fit every-
             * thing without having to create a line-break in a row
             *
             * @method setColumnWidths
             * @return none
             */
            function setColumnWidths() {
                var currColHeader,
                    columnCells,
                    cellData,
                    headerWidth,
                    cellWidth,
                    cellDataWidth = 0;


                _.each(scope.tableColumns, function(value, index) {
                    var newWidth;

                    columnCells = tcols[value];
                    currColHeader = theadCols.filter("[data-col-header='" + value + "']");
                    cellData = columnCells.find('.cell-data');

                    if (cellData.length > 0) {
                        cellDataWidth = Math.max.apply( null, cellData.map( function () {
                            return $(this).outerWidth( true );
                        }).get() );
                    }

                    cellWidth = Math.max.apply( null, columnCells.map( function () {
                        return $(this).outerWidth( true );
                    }).get() );

                    headerWidth = currColHeader.outerWidth( true );


                    cellWidth = Math.max(cellDataWidth, cellWidth);

                    // The last column needs to take into account the scrollbar
                    if (index !== (scope.tableColumns.length - 1)) {
                        newWidth = Math.max(cellWidth, headerWidth);

                        currColHeader.css('width', newWidth);
                        // for text-wrap: ellipsis
                        cellData.css('max-width', newWidth);
                        columnCells.css('width', newWidth);
                    }
                });

                // For the scrollbar in the last column
                if (cellWidth > (headerWidth - scrollbarWidth)) {
                    headerWidth = cellWidth + scrollbarWidth;
                } else {
                    cellWidth = headerWidth - scrollbarWidth;
                }

                currColHeader.css('width', headerWidth);
                columnCells.css('width', cellWidth);
                cellData.css('max-width', cellWidth);
            }

            /**
             * Angular filtering rewrites everything in the table on the DOM,
             * this is incredibly slow. Our sort simply adds a class that hides
             * any filtered objects and is much faster.
             *
             * @method filterScrollableTable
             * @return none
             */
            function filterScrollableTable() {

                scope.visibleRowCount = 0;
                scope.filteredRowCount = 0;
                _.each (trows, function(row) {
                    var rowElem = $(row);
                    _.each(scope.filterObject, function(filterVal, filterCol) {
                        var rowValue = rowElem.find(".app-td[data-col-header='" + filterCol + "'] > .cell-data").html();
                        if (rowValue.indexOf(filterVal) === -1) {
                            rowElem.addClass('filtered');
                            ++scope.filteredRowCount;
                        } else {
                            ++scope.visibleRowCount;
                            if ((scope.visibleRowCount % 2) === 0) {
                                rowElem.addClass('even-row');
                            } else {
                                rowElem.removeClass('even-row');
                            }
                            rowElem.removeClass('filtered');
                        }
                    });
                });
            }

            /**
             * Sets row color for every other row on a scrollable table, $index
             * doesn't work since we are using css/classes to hide rows instead
             * of removing them from the DOM
             *
             * @method setScrollableRowColors
             * @return none
             */
            function setScrollableRowColors() {
                var visibleRowCount = 0;
                _.each (trows, function(row) {
                    var rowElem = $(row);
                    if (!rowElem.hasClass('filtered')) {
                        ++visibleRowCount;
                        if ((visibleRowCount % 2) === 0) {
                            rowElem.addClass('even-row');
                        } else {
                            rowElem.removeClass('even-row');
                        }
                    }
                });
                safeApply(scope);
            }

            /**
             * Calculates the number of visible rows on a scrollable table using
             * the properties of the table and rows
             *
             * @method calculateVisibleRows
             * @return none
             */
            function calculateVisibleRows() {
                var containerHeight = tbody.innerHeight(),
                    containerScroll = tbody.scrollTop();
                scope.visibleRowsStartIndex = parseInt(containerScroll / rowHeight + visibleStartRowMargin) + 1;
                scope.visibleRowsEndIndex = parseInt((containerScroll + containerHeight) / rowHeight + visibleEndRowMargin);
                safeApply(scope);
            }

             /**
             * used to determine the ng-class of our headers, to show what is
             * being used to sort the table and in what direction
             *
             * @method scope.isSortingBy
             * @param {String} col
             *  The name of the column being checked
             * @return {Integer} 0 for not sorted, 1 for Asc sort, -1 for Desc
             */
            scope.isSortingBy = function(col) {
                var sanitizedCol = sanitizePredicate(col),
                    sanitizedReverseCol = sanitizePredicate(col, true),
                    ret = 0;

                _.each(scope.predicate, function(value) {
                    if (value === sanitizedCol) {
                        ret = 1;

                        // return false will break from lodash foreach
                        return false;
                    } else if (value === sanitizedReverseCol) {
                        ret = -1;

                        return false;
                    }
                });

                return ret;
            };

            /**
             * Generates a sorting predicate for angular to base its sort on
             *
             * @method scope.sortTableBy
             * @param {String} predicate
             *  The name of the new column to sort by
             * @return none
             */
            scope.sortTableBy = function(predicate) {
                var currIndex        = scope.predicate.indexOf(sanitizePredicate(predicate)),
                    currReverseIndex = scope.predicate.indexOf(sanitizePredicate(predicate, true)),
                    reverse = true;

                if (currIndex === -1 && currReverseIndex !== -1) {
                    currIndex = currReverseIndex;
                    reverse = false;
                }

                if (currIndex !== -1 && hotkeysFactory.keybindings.shiftKey) {
                    if (scope.predicate.length > 1) {
                        scope.predicate.splice(currIndex, 1);
                    } else {
                        scope.predicate[currIndex] = sanitizePredicate(predicate, reverse);
                    }
                } else if (currIndex !== -1 && !hotkeysFactory.keybindings.shiftKey) {
                    scope.predicate[currIndex] = sanitizePredicate(predicate, reverse);
                } else if (currIndex === -1 && hotkeysFactory.keybindings.shiftKey) {
                    scope.predicate.push(sanitizePredicate(predicate));
                } else {
                    scope.predicate = [sanitizePredicate(predicate)];
                }

                if (scope.pagingType && (scope.pagingType === 'scrollable' || scope.pagingType === 'scrollable-paging')) {
                    $timeout(function() {
                        trows = tbody.find('.app-tr');
                        setScrollableRowColors();
                    }, 0);
                }
            };


            /**
             * Determines if enough filter values are set to filter our table
             *
             * @method scope.handleFilterChange
             * @param {String} [item]
             *  The name of a column selected by the dropdown, possibly null
             * @return none
             */
            scope.handleFilterChange = function(item) {
                var column,
                    input = filterInputElem.val();

                if (item && (typeof item === 'string')) {
                    column = item;
                } else {
                    column = filterColumnElem.val();
                }

                scope.filterObject = {};
                if (column && input) {
                    scope.filterObject[column] = input;

                    if (!scope.pagingType || scope.pagingType === 'basic') {
                        scope.filteredRows = filterFilter(scope.tableData, scope.filterObject);
                        scope.calculatePageCount();
                    } else if (scope.pagingType === 'scrollable' || scope.pagingType === 'scrollable-paging') {
                        $timeout(function() {
                            filterScrollableTable();
                            setScrollableRowColors();
                        }, 0);
                    }
                }
            };

            /**
             * Calculates the number of pages depending on the page size
             *
             * @method scope.calculatePageCount
             * @param {Integer} [newSize]
             *  A new page size passed in from the dropdown, possibly null
             * @return none
             */
            scope.calculatePageCount = function (newSize) {
                var rowCount,
                    pageSize = scope.pager.pageSize.value,
                    remainder;

                if(!scope.pagingType || scope.pagingType === 'basic') {
                    if (newSize) {
                        scope.pager.pageSize.value = newSize;
                        pageSize = newSize;
                    }
                    rowCount = scope.filteredRows.length;
                    remainder = (rowCount % pageSize) ? 1 : 0;
                } else if (scope.pagingType === 'scrollable-paging') {
                    scope.pager.pageSize.value = scope.visibleRowsEndIndex - scope.visibleRowsStartIndex + 1;
                    pageSize = scope.pager.pageSize.value;

                    rowCount = scope.visibleRowCount;
                    remainder = (rowCount % pageSize) ? 1 : 0;
                }

                scope.pager.pageCount = (rowCount / pageSize) + remainder;
            };

            /**
             * Changes the table to the newly selected page
             *
             * @method scope.selectPage
             * @param {Integer} pageNumber
             *  The index of the page we need to switch to
             * @return none
             */
            scope.selectPage = function(pageNumber) {
                var pageSize = scope.pager.pageSize.value;
                scope.pager.currentPage = pageNumber;
                scope.pager.currentIndex = pageNumber * pageSize;

                if (scope.pagingType && scope.pagingType === 'scrollable-paging') {
                    tbody.animate({
                        scrollTop: pageNumber * pageSize * rowHeight
                    }, 1000);
                }
            };

            /**
             * onSelect override function for the table dropdowns.
             *
             * @method scope.selectionHandler
             * @param {String} item
             *  The selected item.
             * @param {String} column
             *  The name of the column containing the dropdown that was used.
             * @param {Integer} rowIndex
             *  The index of the row that was selected, does not currently work.
             * @return none
             */
            scope.selectionHandler = function(item, column, rowIndex) {
                console.log('selected made on row ' + rowIndex + ' in col ' + column + ', value: ' + item);

                // In the case we pick a selection larger than the column width
                $timeout(function () {
                    setColumnWidths();
                }, 0);
            };

            scope.tableData = scope.tableConfig.tableData;
            if(scope.tableConfig.columns) {
                scope.tableColumns = scope.tableConfig.columns;
            } else {
                scope.tableColumns = [];
                _.each(scope.tableData[0], function(value, key) {
                    if(!scope.tableConfig.ignoredData || scope.tableConfig.ignoredData.indexOf(key) === -1) {
                        scope.tableColumns.push(key);
                    }
                });
            }

            scope.filter = {
                column: {
                    value: ''
                },
                input: {
                    value: ''
                }
            };

            scope.pager = {
                minPageSize: 5,
                maxPageSize: 15,
                pageSize: {
                    value: 8
                },
                currentIndex: 0,
                currentPage: 0
            };

            if (scope.minPageSize) {
                scope.pager.minPageSize = scope.minPageSize;
            } else {
                scope.pager.minPageSize = 5;
            }
            if (scope.maxPageSize) {
                scope.pager.maxPageSize = scope.maxPageSize;
            } else {
                scope.pager.maxPageSize = 15;
            }

            if (!scope.pagingType || scope.pagingType === 'basic') {
                scope.filteredRows = filterFilter(scope.tableData, scope.filterObject);
            }

            scope.predicate = [sanitizePredicate(scope.tableColumns[0])];
            scope.reverse = true;

            $timeout(function() {
                tbody = elem.find('.app-tbody');
                thead = elem.find('.app-thead');
                trows = tbody.find('.app-tr');
                theadCols = thead.find('.app-th');
                _.each(scope.tableColumns, function(value) {
                    tcols[value] = tbody.find(".app-td[data-col-header='" + value + "']");
                });

                rowHeight = parseInt(trows.outerHeight());
                scrollbarWidth = getScrollbarWidth();
                calculateVisibleRows();
                scope.rowCount = trows.length;
                scope.visibleRowCount = scope.rowCount;
                scope.calculatePageCount(scope.pager.pageSize.value);

                scope.pager.availPageSizes = [];
                for(var i = scope.pager.minPageSize; i <= scope.pager.maxPageSize; ++i) {
                    scope.pager.availPageSizes.push(i);
                }
                initHotkeys();
                if (scope.pagingType && (scope.pagingType === 'scrollable' || scope.pagingType === 'scrollable-paging')) {
                    setColumnWidths();

                    setScrollableRowColors();

                    tbody.on('scroll', calculateVisibleRows);
                    $(window).on('resize', function() {
                        scope.calculatePageCount();
                        calculateVisibleRows();
                    });
                }

                filterInputElem = $(element).find('.filter-input > input');
                filterColumnElem = $(element).find('.filter-column > input');
                filterInputElem.on('input', scope.handleFilterChange);

                elem.find('.app-table').removeClass('loading');
            }, 0);
        }
    };
}]);
