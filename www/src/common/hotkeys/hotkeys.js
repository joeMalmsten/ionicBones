/*global angular require*/
'use strict';
require('../../../../node_modules/angular-hotkeys/build/hotkeys');

angular.module('app.hotkeys', ['cfp.hotkeys'])
.factory('hotkeysFactory', ['hotkeys', function (hotkeys) {
    var self = {
            keybindings: {}
        },
        $ = require('jquery'),
        _ = require('lodash'),
        documentElem = $(document);

    function defaultCallback(event, hotkey) {
        var keyCombo = "";

        // For multiple Keypresses, e.eg.
        //  shift + ctrl keys would be 'shiftKeyctrlKey'
        _.each(hotkey.combo, function(value){
            keyCombo += value + "Key";
        });
        self.keybindings[keyCombo] = true;
        documentElem.on('keyup', function(event) {
            if (event.which === 16) {
                self.keybindings[keyCombo] = false;
                documentElem.off('keyup');
            }
        });
    }

    self.bind = function(combo, scope, cb, desc) {
        hotkeys.bindTo(scope)
        .add({
            combo: combo,
            description: desc,
            callback: cb || defaultCallback
        });
    };
    self.unbind = function(combo) {
        hotkeys.del(combo);
    };

    return self;
}]);
