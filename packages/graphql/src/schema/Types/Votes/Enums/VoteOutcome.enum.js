"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteOutcomeEnum = void 0;
var client_1 = require("@prisma/client");
var nexus_1 = require("nexus");
exports.VoteOutcomeEnum = nexus_1.enumType({
    name: 'VoteOutcome',
    members: client_1.VoteOutcome
});
