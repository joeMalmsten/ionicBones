/*global require module angular*/
/*jslint node: true */
'use strict';
require('./components/login/loginCtrl');
require('./components/dashboard/dashboardCtrl');
require('./components/bonesNavbar/bonesNavbar');

module.exports = angular.module('bones', [
    'ionic',
    'bones.navbar',
    'bones.login',
    'bones.dashboard'
])
.config(require('./routes'))
.run(require('./main'));
