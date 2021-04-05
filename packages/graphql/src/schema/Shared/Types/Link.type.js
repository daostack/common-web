"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkType = exports.LinkInputType = void 0;
var nexus_1 = require("nexus");
exports.LinkInputType = nexus_1.inputObjectType({
    name: 'LinkInput',
    definition: function (t) {
        t.nonNull.string('title', {
            description: 'The display title of the link'
        });
        t.nonNull.string('url', {
            description: 'The actual link part of the link'
        });
    }
});
exports.LinkType = nexus_1.objectType({
    name: 'Link',
    definition: function (t) {
        t.nonNull.string('title', {
            description: 'The display title of the link'
        });
        t.nonNull.string('url', {
            description: 'The actual link part of the link'
        });
    }
});
