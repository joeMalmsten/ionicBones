/*global angular require module*/

// Put all var declarations on top, hoisting does this anyway
var dashboardModule;
require('../../common/appTable/appTable');
require('../../common/appFlyout/appFlyout');

dashboardModule = angular.module('app.dashboard', ['app.table', 'app.flyout'])
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

    function initTableObject(title, options, ignoredRowData, tableRowData, scrollType) {
        return {
            title: title,
            availableOptions: options,
            ignoredData: ignoredRowData,
            tableData: tableRowData,
            scrollType: scrollType || 'scrollable'
        };
    }

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

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

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

    $scope.setActiveTable = function(activeIndex) {
        $scope.activeIndex = activeIndex;
    };
    $scope.activeIndex = 0;
    $scope.totalRows = 0;

    _.each($scope.tables, function(table) {
        $scope.totalRows += table.tableData.length;
    });
}]);

module.exports = dashboardModule;
