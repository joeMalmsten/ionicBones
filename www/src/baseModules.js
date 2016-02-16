/*global module angular require*/
require('./components/login/loginCtrl');
require('./components/dashboard/dashboardCtrl');
require('./components/bonesNavBar/bonesNavBar');

module.exports = angular.module('baseModules', [
    'ionic',
    'bones.navbar',
    'bones.login',
    'bones.dashboard'
]);
