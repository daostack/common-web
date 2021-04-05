"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalTypes = void 0;
var JoinProposal_type_1 = require("./Types/JoinProposal.type");
var FundingProposal_type_1 = require("./Types/FundingProposal.type");
var CreateJoinProposal_mutation_1 = require("./Mutations/CreateJoinProposal.mutation");
var CreateFundingProposal_mutation_1 = require("./Mutations/CreateFundingProposal.mutation");
var ProposalLink_input_1 = require("./Inputs/ProposalLink.input");
var ProposalFile_input_1 = require("./Inputs/ProposalFile.input");
var ProposalImage_input_1 = require("./Inputs/ProposalImage.input");
var FinalizeProposalMutation_1 = require("./Mutations/FinalizeProposalMutation");
exports.ProposalTypes = [
    JoinProposal_type_1.JoinProposalType,
    FundingProposal_type_1.FundingProposalType,
    CreateJoinProposal_mutation_1.CreateJoinProposalInput,
    CreateJoinProposal_mutation_1.CreateJoinProposalMutation,
    FinalizeProposalMutation_1.FinalizeProposalMutation,
    CreateFundingProposal_mutation_1.CreateFundingProposalInput,
    CreateFundingProposal_mutation_1.CreateFundingProposalMutation,
    ProposalLink_input_1.ProposalLinkInput,
    ProposalFile_input_1.ProposalFileInput,
    ProposalImage_input_1.ProposalImageInput
];
