"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteType = void 0;
var nexus_1 = require("nexus");
exports.VoteType = nexus_1.objectType({
    name: 'Vote',
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
    }
});
