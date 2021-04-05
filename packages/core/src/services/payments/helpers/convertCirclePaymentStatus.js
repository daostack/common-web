"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCirclePaymentStatus = void 0;
var client_1 = require("@prisma/client");
var _errors_1 = require("@errors");
var convertCirclePaymentStatus = function (status) {
    switch (status) {
        case 'confirmed':
        case 'paid':
            return client_1.PaymentStatus.Successful;
        case 'failed':
            return client_1.PaymentStatus.Unsuccessful;
        case 'pending':
            return client_1.PaymentStatus.Pending;
        default:
            throw new _errors_1.CommonError("Unknown circle status " + status);
    }
};
exports.convertCirclePaymentStatus = convertCirclePaymentStatus;
