/*global angular require describe it expect beforeEach*/
'use strict';

// This is here so that any code that gets added to the app will get included
//  inside the istanbul test coverage. There has to be a better way to handle
//  the visibility of untested files.
require('../src/baseModules');

describe('Pull in all the base dependencies', function() {
    beforeEach(angular.mock.module('baseModules'));
    it('will not die when trying to pull in all known dependencies', function() {
        expect(true).toBe(true);
    });
});
