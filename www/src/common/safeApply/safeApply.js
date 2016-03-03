/*global module*/
'use strict';

/**
 * tells the scope to apply any changes if the digest cycle is at a safe
 * point to do so.
 *
 * @method safeApply
 * @param {Object} scope
 *  The scope being updated
 * @param {Function} [fn]
 *  Optional callback when the apply is called, I never use it
 * @return none
 */
module.exports = function safeApply(scope, fn) {
    var phase = scope.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
        scope.$eval(fn);
    } else {
        scope.$apply(fn);
    }
};
