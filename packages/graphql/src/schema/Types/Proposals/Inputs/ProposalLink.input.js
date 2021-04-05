"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalLinkInput = void 0;
var nexus_1 = require("nexus");
exports.ProposalLinkInput = nexus_1.inputObjectType({
    name: 'ProposalLinkInput',
    definition: function (t) {
        t.nonNull.string('title');
        t.nonNull.string('url');
    }
});
