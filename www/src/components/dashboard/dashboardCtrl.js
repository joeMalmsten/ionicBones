/*global angular require module*/

// Put all var declarations on top, hoisting does this anyway
var dashboardModule;
require('../../common/appTable/appTable');
require('../../common/appFlyout/appFlyout');
require('../../../assets/mocks/mockFlyout/mockFlyout');

dashboardModule = angular.module('app.dashboard', ['app.table', 'app.flyout', 'app.mockFlyout'])
.controller('DashboardCtrl', ['$scope', function($scope) {
    var availableOptionsObj = {
        html: "<div app-flyout " +
                "container='.dashboard-page' " +
                "items='availableOptions'>" +
                "Available Options" +
                "</div>"
    };

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    $scope.availableOptions = ['Accept', 'Modify', "temp 1", "temp 2"];
    $scope.mockTableData = [
        {
            "Store Number": 101,
            "Store Name": "Temp Store 1",
            "Business Date": formatDate("2016-01-31"),
            "Available Actions": availableOptionsObj,
            "Estimated Sales": 0.02
        },
        {
            "Store Number": 101,
            "Store Name": "Temp Store 1",
            "Business Date": formatDate("2016-01-15"),
            "Available Actions": availableOptionsObj,
            "Estimated Sales": 0.02
        },
        {
            "Store Number": 101,
            "Store Name": "Temp Store 1",
            "Business Date": formatDate("2016-02-15"),
            "Available Actions": availableOptionsObj,
            "Estimated Sales": 0.02
        },
        {
            "Store Number": 102,
            "Store Name": "Temp Store 2",
            "Business Date": formatDate("2016-02-01"),
            "Available Actions": availableOptionsObj,
            "Estimated Sales": 1050.0
        },
        {
            "Store Number": 103,
            "Store Name": "Temp Store 3",
            "Business Date": formatDate("2016-04-01"),
            "Available Actions": availableOptionsObj,
            "Estimated Sales": 1000.0
        },
        {
            "Store Number": 104,
            "Store Name": "Temp Store 4",
            "Business Date": formatDate("2015-02-15"),
            "Available Actions": availableOptionsObj,
            "Estimated Sales": 30.0
        }
    ];
}]);

module.exports = dashboardModule;
