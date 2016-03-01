/*global angular require*/
'use strict';
var safeApply = require("../safeApply/safeApply");

require('../appBindHtmlCompile/appBindHtmlCompile');
require('../../../lib/smoothscroll.min');
require('../appFilters/appFilters');
require('../hotkeys/hotkeys');
require("./appTable.html");

angular.module('app.table', ['templates', 'app.bindHtmlCompile', 'app.input', 'app.flyout', 'app.filters', 'app.hotkeys'])
.controller('TableCtrl', [function() {
}])
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
            // Needed for predicates with white space, angulare requires
            //  single spaces to parse them properly

            function sanitizePredicate(predicate, reverse) {
                var ret = "'";

                if (reverse) {
                    ret = '-' + ret;
                }

                ret += predicate.replace(["'", '-'], '') + "'";

                return ret;
            }

            function initHotkeys() {
                hotkeysFactory.bind('shift', scope);

                scope.$on("$destroy", function() {
                    hotkeysFactory.unbind("shift");
                    scope.$off("$destroy");
                });
            }

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

            function initColumnWidths() {
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
            function calculateVisibleRows() {
                var containerHeight = tbody.innerHeight(),
                    containerScroll = tbody.scrollTop();
                scope.visibleRowsStartIndex = parseInt(containerScroll / rowHeight + visibleStartRowMargin) + 1;
                scope.visibleRowsEndIndex = parseInt((containerScroll + containerHeight) / rowHeight + visibleEndRowMargin);
                safeApply(scope);
            }

            scope.isSortingBy = function(col) {
                var sanitizedCol = sanitizePredicate(col),
                    sanitizedReverseCol = sanitizePredicate(col, true),
                    ret = 0;

                _.each(scope.predicate, function(value) {
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

            scope.handleFilterChange = function(event, item) {
                var column = item || filterColumnElem.val(),
                    input = filterInputElem.val();
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

            scope.selectionHandler = function(item, column, rowIndex) {
                console.log('selected made on row ' + rowIndex + ' in col ' + column + ', value: ' + item);

                // In the case we pick a selection larger than the column width
                $timeout(function () {
                    initColumnWidths();
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
                    initColumnWidths();

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
