/*global require module angular */
/*jslint node: true */
'use strict';

require('angular');
require('ionic');
require('./controllers/login/loginCtrl');

module.exports = angular.module('ionicBones', [
    'ionic',
    'ionicBones.login'
])
.config(require('./routes'))
.run(require('./main'));
