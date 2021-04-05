"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobs = void 0;
var PaymentsQueue_1 = require("./PaymentsQueue");
var VotesQueue_1 = require("./VotesQueue");
exports.jobs = {
    addPaymentJob: PaymentsQueue_1.addPaymentJob,
    addVotesJob: VotesQueue_1.addVotesJob
};
