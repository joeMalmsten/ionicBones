/*global angular require describe it expect beforeEach*/
'use strict';

// This is here so that any code that gets added to the app will get included
//  inside the istanbul test coverage. There has to be a better way to handle
//  the visibility of untested files.
require('../src/baseModules');

describe('Reality is working, on the app', function() {
    beforeEach(angular.mock.module('bones'));
    it('has a truth that is true', function() {
        expect(true).toBe(true);
    });
});
