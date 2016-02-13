/*global require module angular*/
/*jslint node: true */
'use strict';
require('./components/login/loginCtrl');

module.exports = angular.module('ionicBones', [
    'ionic',
    'ionicBones.login'
])
.config(require('./routes'))
.run(require('./main'));
