"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProposalExpiresAtDate = void 0;
var client_1 = require("@prisma/client");
var generateProposalExpiresAtDate = function (type) {
    var countdownPeriod = Number(type === client_1.ProposalType.JoinRequest
        ? process.env['Proposals.Join.Countdown']
        : process.env['Proposals.Funding.Countdown']);
    return new Date(new Date().getTime() + (countdownPeriod * 1000));
};
exports.generateProposalExpiresAtDate = generateProposalExpiresAtDate;
