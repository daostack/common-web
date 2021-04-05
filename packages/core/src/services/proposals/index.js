"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proposalsService = exports.fundingProposalService = exports.joinProposalService = void 0;
var createJoinProposalCommand_1 = require("./join/command/createJoinProposalCommand");
var createFundingProposalCommand_1 = require("./funding/command/createFundingProposalCommand");
var updateProposalVoteCountsCommand_1 = require("./shared/command/updateProposalVoteCountsCommand");
var proposalHasMajorityQuery_1 = require("./shared/queries/proposalHasMajorityQuery");
var finalizeProposalCommand_1 = require("./shared/command/finalizeProposalCommand");
var processApprovedOneTimeJoinRequest_1 = require("./join/command/process/processApprovedOneTimeJoinRequest");
exports.joinProposalService = {
    commands: {
        create: createJoinProposalCommand_1.createJoinProposalCommand
    },
    process: {
        approvedJoinRequest: null,
        approvedOneTimeJoinRequest: processApprovedOneTimeJoinRequest_1.processApprovedOneTimeJoinRequestCommand,
        approvedSubscriptionJoinRequest: null // @todo
    }
};
exports.fundingProposalService = {
    create: createFundingProposalCommand_1.createFundingProposalCommand
};
exports.proposalsService = {
    join: exports.joinProposalService,
    funding: exports.fundingProposalService,
    // Shared commands and queries
    updateVoteCount: updateProposalVoteCountsCommand_1.updateProposalVoteCountsCommand,
    finalize: finalizeProposalCommand_1.finalizeProposalCommand,
    hasMajority: proposalHasMajorityQuery_1.proposalHasMajorityQuery
};
