/*global module angular require*/
require('./components/login/loginCtrl');
require('./components/dashboard/dashboardCtrl');
require('./components/appHeader/appHeader');

module.exports = angular.module('baseModules', [
    'ionic',
    'app.header',
    'app.login',
    'app.dashboard'
]);
