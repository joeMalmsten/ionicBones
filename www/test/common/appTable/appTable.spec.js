/* global require describe beforeEach inject it expect angular*/
require('../../../src/common/appTable/appTable');

describe('appTable', function() {
    var $ = require('jquery'),
        mockHtmlCell = '<div class="html-mock-content" ng-repeat="n in [2, 4, 6, 8, 10]">{{n}}</div>',
        mockOptions = ['one', 'two', 'three'],
        $compile,
        $rootScope,
        directiveElem,
        scope;

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    function initMockTableData(rowCount) {
        var tableRowObject = [],
            storeNum;
        for (var i = 0; i < rowCount; ++i) {
            storeNum = parseInt(100 + (i * 6));
            tableRowObject.push({
                'Store Number': storeNum,
                'Store Name': 'Temp Store ' + storeNum,
                'Business Date': formatDate(new Date().getTime() * Math.random()),
                'Estimated Sales': {
                    editable: true,
                    value: parseInt(Math.random() * rowCount)
                },
                'Reason': {
                    html: mockHtmlCell
                },

                'metaData': {
                    'action': 'none'
                }
            });
        }
        return tableRowObject;
    }

    // mock the module that contains the directive we are testing
    beforeEach(function() {
        angular.mock.module('app.table');
    });

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_) {
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    describe('table - scrolling', function() {
        var mockDirective = '<app-table paging-type="scrollable-paging" table-config="table"></app-table>',
            rowCount = 5,
            mockTableData = {
                title: 'mock-table',
                availableOptions: mockOptions,
                ignoredData: ['metaData'],
                tableData: initMockTableData(rowCount),
                scrollType: 'scrollable'
            },
            element;

        beforeEach(inject(function() {
            element = angular.element(mockDirective);
            scope = $rootScope.$new();
            scope.table = mockTableData;

            directiveElem = $compile(element)(scope);
            scope.$digest();
        }));

        it('compiles the directive content into angular code and makes a dropdown', inject(function($timeout) {
            // Given:
            var table;

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            table = $(directiveElem).find('.app-table');

            // Then:
            expect(table.length).toBe(1);
        }));

        it('will complile the html passed into a cell if row[col].html is defined', inject(function($timeout) {
            // Given:
            var table,
                listElems;

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            table = $(directiveElem).find('.app-table');
            listElems = table.find('.html-mock-content');

            // Then:
            expect(listElems.length).toBe(rowCount * 5);
        }));

        it('not filter the table if a filter column is not set', inject(function($timeout) {
            // Given:
            var filterInputElem,
                rows,
                directiveElemSelector = $(directiveElem),
                table = directiveElemSelector.find('.app-table'),
                isolateScope = directiveElem.isolateScope();

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            filterInputElem = directiveElemSelector.find('.filter-input > input');
            rows = table.find('.app-tr');

            filterInputElem.val('10');

            // When:
            isolateScope.handleFilterChange();

            // Then:
            // + 1 to rowCount to account for header row
            expect(rows.length).toBe(rowCount + 1);
            expect(rows.filter('.filtered').length).toBe(0);
        }));

        it('not filter the table if a filter input text is not set', inject(function($timeout) {
            // Given:
            var filterColElem,
                rows,
                directiveElemSelector = $(directiveElem),
                table = directiveElemSelector.find('.app-table'),
                isolateScope = directiveElem.isolateScope();

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            filterColElem = directiveElemSelector.find('.filter-column > input');
            rows = table.find('.app-tr');

            filterColElem.val('Store Number');

            // When:
            isolateScope.handleFilterChange();

            // Then:
            expect(rows.filter('.filtered').length).toBe(0);
        }));

        it('filter the table if both a filter column and input text are set', inject(function($timeout) {
            // Given:
            var filterColElem,
                filterInputElem,
                rows,
                directiveElemSelector = $(directiveElem),
                table = directiveElemSelector.find('.app-table'),
                isolateScope = directiveElem.isolateScope();

            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            filterColElem = directiveElemSelector.find('.filter-column > input');
            filterInputElem = directiveElemSelector.find('.filter-input > input');
            rows = table.find('.app-tr');

            filterColElem.val('Store Number');
            filterInputElem.val('10');

            // When:
            isolateScope.handleFilterChange();
            $timeout.flush();
            $timeout.verifyNoPendingTasks();

            // Then:
            expect(rows.filter('.filtered').length).toBe(3);
        }));
    });
});
