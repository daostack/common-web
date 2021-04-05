"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteTypes = void 0;
var Vote_type_1 = require("./Types/Vote.type");
var VoteOutcome_enum_1 = require("./Enums/VoteOutcome.enum");
var CreateVote_mutation_1 = require("./Mutations/CreateVote.mutation");
exports.VoteTypes = [
    Vote_type_1.VoteType,
    VoteOutcome_enum_1.VoteOutcomeEnum,
    CreateVote_mutation_1.CreateVoteInput,
    CreateVote_mutation_1.CreateVoteMutation
];
