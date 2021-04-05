"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
var createOneTimePaymentCommand_1 = require("./commands/createOneTimePaymentCommand");
var updatePaymentStatusCommand_1 = require("./commands/updatePaymentStatusCommand");
exports.paymentService = {
    createOneTimePayment: createOneTimePaymentCommand_1.createOneTimePaymentCommand,
    updateStatus: updatePaymentStatusCommand_1.updatePaymentStatusCommand
};
