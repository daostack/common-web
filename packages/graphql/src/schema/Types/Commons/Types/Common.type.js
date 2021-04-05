"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonType = void 0;
var nexus_1 = require("nexus");
exports.CommonType = nexus_1.objectType({
    name: 'Common',
    definition: function (t) {
        t.nonNull.id('id', {
            description: 'The main identifier of the item'
        });
        t.nonNull.date('createdAt', {
            description: 'The date, at which the item was created'
        });
        t.nonNull.date('updatedAt', {
            description: 'The date, at which the item was last modified'
        });
        t.nonNull.string('name', {
            description: 'The name of the common as provided'
        });
        t.nonNull.boolean('whitelisted', {
            description: 'The whitelisting state of a common'
        });
    }
});
