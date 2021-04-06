"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proposalService = exports.fundingProposalService = exports.joinProposalService = void 0;
var createJoinProposalCommand_1 = require("./join/command/createJoinProposalCommand");
var processApprovedOneTimeJoinRequest_1 = require("./join/command/process/processApprovedOneTimeJoinRequest");
var processApprovedSubscriptionJoinRequest_1 = require("./join/command/process/processApprovedSubscriptionJoinRequest");
var createFundingProposalCommand_1 = require("./funding/command/createFundingProposalCommand");
var processApprovedFundingRequest_1 = require("./funding/command/process/processApprovedFundingRequest");
var processRejectedFundingRequest_1 = require("./funding/command/process/processRejectedFundingRequest");
var finalizeProposalCommand_1 = require("./shared/command/finalizeProposalCommand");
var proposalHasMajorityQuery_1 = require("./shared/queries/proposalHasMajorityQuery");
var updateProposalVoteCountsCommand_1 = require("./shared/command/updateProposalVoteCountsCommand");
exports.joinProposalService = {
    commands: {
        create: createJoinProposalCommand_1.createJoinProposalCommand
    },
    process: {
        approvedOneTime: processApprovedOneTimeJoinRequest_1.processApprovedOneTimeJoinRequestCommand,
        approvedSubscription: processApprovedSubscriptionJoinRequest_1.processApprovedSubscriptionJoinRequest
    }
};
exports.fundingProposalService = {
    create: createFundingProposalCommand_1.createFundingProposalCommand,
    process: {
        approved: processApprovedFundingRequest_1.processApprovedFundingRequest,
        rejected: processRejectedFundingRequest_1.processRejectedFundingRequest
    }
};
exports.proposalService = {
    join: exports.joinProposalService,
    funding: exports.fundingProposalService,
    // Shared commands and queries
    updateVoteCount: updateProposalVoteCountsCommand_1.updateProposalVoteCountsCommand,
    finalize: finalizeProposalCommand_1.finalizeProposalCommand,
    hasMajority: proposalHasMajorityQuery_1.proposalHasMajorityQuery
};
