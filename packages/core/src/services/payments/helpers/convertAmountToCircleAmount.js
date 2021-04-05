"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAmountToCircleAmount = void 0;
var convertAmountToCircleAmount = function (amount) { return ({
    amount: Math.round(amount) / 100,
    currency: 'USD'
}); };
exports.convertAmountToCircleAmount = convertAmountToCircleAmount;
