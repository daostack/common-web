"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalFileInput = void 0;
var nexus_1 = require("nexus");
exports.ProposalFileInput = nexus_1.inputObjectType({
    name: 'ProposalFileInput',
    definition: function (t) {
        t.nonNull.string('value');
    }
});
