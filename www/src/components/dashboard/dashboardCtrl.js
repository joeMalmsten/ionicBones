/*global angular require module*/

// Put all var declarations on top, hoisting does this anyway
var dashboardModule;
require('../../common/appTable/appTable');
require('../../common/appFlyout/appFlyout');

/**
 * module contains the logic for the dashboard page
 *
 * Dependencies: app.table, app.flyout
 *
 * @module app.dashboard
 * @main
 */
dashboardModule = angular.module('app.dashboard', ['app.table', 'app.flyout'])

/**
 * A controller that contains all of the Dashboard page logic
 *
 * @class DashboardCtrl
 * @param {Object} $scope
 *  The isolate scope of the controller.
 */
.controller('DashboardCtrl', ['$scope', function($scope) {
    var _ = require('lodash'),
        reasonCellObjHtml = '<div app-flyout ' +
            'container=".dashboard-page" ' +
            'items="tableConfig.availableOptions"' +
            'current-item="row.metaData.action"' +
            'on-select="selectionHandler(item, col, $index)">' +
            '{{row.metaData.action}}' +
            '</div>',
        mockEstRevTableData = initMockTableData(75),
        mockLowSalesTableData = initMockLongTableData(50),
        mockThirdTableData = initMockTableData(25);

    $scope.pageTitle = 'Dashboard';
    $scope.mockBreadcrumb = 'Home -> Dashboard';

    /**
     * Creates a tableConfig object from the given params
     *
     * @method initTableObject
     * @param {String} title
     *  The title of the new table
     * @param {Array} options
     *  A list of selectable options for dropdowns in the table
     * @param {Array} ignoredRowData
     *  A list of present data objects to not turn into table columns
     * @param {String} scrollType
     *  The type of pagination/scrolling the table will use
     * @return a tableConfig object
     */
    function initTableObject(title, options, ignoredRowData, tableRowData, scrollType) {
        return {
            title: title,
            availableOptions: options,
            ignoredData: ignoredRowData,
            tableData: tableRowData,
            scrollType: scrollType || 'scrollable'
        };
    }

    /**
     * Creates some fake table data while we do not have an API to get data from
     *
     * @method initMockTableData
     * @param {Integer} rowCount
     *  The number of fake rows to generate
     * @return a tableConfig object
     */
    function initMockTableData(rowCount) {
        var tableRowObject = [],
            number;
        for (var i = 0; i < rowCount; ++i) {
            number = parseInt(100 + Math.random() * 100);
            tableRowObject.push({
                'Number': number,
                'Name': 'Temp ' + number,
                'Date': formatDate(new Date().getTime() * Math.random()),
                'Sales': {
                    editable: true,
                    value: parseInt(Math.random() * rowCount)
                },
                'Dropdown': {
                    html: reasonCellObjHtml
                },

                'metaData': {
                    'action': 'none'
                }
            });
        }
        return tableRowObject;
    }

    /**
     * Creates some fake table data while we do not have an API to get data from
     * This fake table has enough columns to force x-axis scrolling for testing
     *
     * @method initMockLongTableData
     * @param {Integer} rowCount
     *  The number of fake rows to generate
     * @return {Array} a list of table rows.
     */
    function initMockLongTableData(rowCount) {
        var tableRowObject = [],
            storeNum;
        for (var i = 0; i < rowCount; ++i) {
            storeNum = parseInt(100 + Math.random() * 100);
            tableRowObject.push({
                'Number': storeNum,
                'Name1': 'Temp Store ' + storeNum,
                'Name2': 'Temp Store ' + storeNum,
                'Name3': 'Temp Store ' + storeNum,
                'Name4': 'Temp Store ' + storeNum,
                'Name5': 'Temp Store ' + storeNum,
                'Name6': 'Temp Store ' + storeNum,
                'Name7': 'Temp Store ' + storeNum,
                'Name8': 'Temp Store ' + storeNum,
                'Name9': 'Temp Store ' + storeNum,
                'Name10': 'Temp Store ' + storeNum,
                'Date': formatDate(new Date().getTime() * Math.random()),
                'Sales': {
                    editable: true,
                    value: parseInt(Math.random() * rowCount)
                },
                'Dropdown': {
                    html: reasonCellObjHtml
                },

                'metaData': {
                    'action': 'none'
                }
            });
        }
        return tableRowObject;
    }

    /**
     * formats a JS Date object into a yyyy-mm-dd string, should be pulled into
     * a common/utilities service or something so it can be shared
     *
     * @method formatDate
     * @param {Object} date
     *  The date object or string to be formatted.
     * @return {String} a formatted date in yyyy-mm-dd format.
     */
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    /**
     * sets which table is in the active view
     *
     * @method setActiveTable
     * @param {Integer} activeIndex
     *  The table index we want to switch to
     * @return none
     */
    $scope.setActiveTable = function(activeIndex) {
        $scope.activeIndex = activeIndex;
    };

    $scope.tables = [
        initTableObject(
            'Table One',
            ['Accept', 'Modify', 'none'],
            ['metaData'],
            mockEstRevTableData
        ),
        initTableObject(
            'Table Two - Long',
            ['Yep, this is low', 'This Could be Low', 'Abandon Ship'],
            ['metaData'],
            mockLowSalesTableData
        ),
        initTableObject(
            'Table Three',
            ['One', 'Two', 'Three'],
            ['metaData'],
            mockThirdTableData
        )
    ];

    $scope.activeIndex = 0;
    $scope.totalRows = 0;

    _.each($scope.tables, function(table) {
        $scope.totalRows += table.tableData.length;
    });
}]);

module.exports = dashboardModule;
