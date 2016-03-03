/*global angular*/
'use strict';

/**
 * Provides new filters usable anywhere this module is included
 *
 * @module app.filters
 */
angular.module('app.filters', [])
/**
 * Returns this model's attributes as...
 *
 * @method range
 * @return {Array} An array of numbers from 0 - range
 */
.filter('range', function() {
    return function(val, range) {
        range = parseInt(range);
        val = [];
        for (var i = 0; i < range; ++i) {
            val.push(i + 1);
        }
        return val;
    };
})
/**
 * Returns this model's attributes as...
 *
 * @method startFrom
 * @return {Array} An array of input values starting from start
 */
.filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = parseInt(start); //parse to int
            return input.slice(start);
        }
        return [];
    };
});
