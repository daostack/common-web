"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardType = void 0;
var nexus_1 = require("nexus");
exports.CardType = nexus_1.objectType({
    name: 'Card',
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
        t.model.user();
    }
});
