"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalImageInput = void 0;
var nexus_1 = require("nexus");
exports.ProposalImageInput = nexus_1.inputObjectType({
    name: 'ProposalImageInput',
    definition: function (t) {
        t.nonNull.string('value');
    }
});
