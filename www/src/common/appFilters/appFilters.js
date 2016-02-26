/*global angular*/
'use strict';

angular.module('app.filters', [])
.filter('range', function() {
    return function(val, range) {
        range = parseInt(range);
        val = [];
        for (var i = 0; i < range; ++i) {
            val.push(i + 1);
        }
        return val;
    };
}).filter('startFrom', function() {
    return function(input, start) {
        if(input) {
            start = parseInt(start); //parse to int
            return input.slice(start);
        }
        return [];
    };
});
