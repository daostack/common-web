"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteService = void 0;
var createVoteCommand_1 = require("./commands/createVoteCommand");
var processVoteCommand_1 = require("./commands/processVoteCommand");
var getProposalVoteCountQuery_1 = require("./queries/getProposalVoteCountQuery");
exports.voteService = {
    create: createVoteCommand_1.createVoteCommand,
    process: processVoteCommand_1.processVoteCommand,
    getVotesCount: getProposalVoteCountQuery_1.getProposalVoteCountQuery
};
