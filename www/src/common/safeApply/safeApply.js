/*global module*/
'use strict';

module.exports = function safeApply(scope, fn) {
    var phase = scope.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
        scope.$eval(fn);
    } else {
        scope.$apply(fn);
    }
};
