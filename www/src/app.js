/*global require module angular */
/*jslint node: true */
'use strict';

require('ionic');
require('./controllers/login/loginCtrl');

module.exports = angular.module('RAS', [
    'ionic',
    'RAS.login'
])
.config(require('./routes'))
.run(require('./main'));
