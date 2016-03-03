/*global require module angular*/
/*jslint node: true */
'use strict';
require('./baseModules');

module.exports = angular.module('app', ['baseModules'])
.config(require('./routes'))
.run(require('./main'));
