"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOneTimePaymentCommand = void 0;
var _errors_1 = require("@errors");
var client_1 = require("@prisma/client");
var _toolkits_1 = require("@toolkits");
var createPaymentCommand_1 = require("./createPaymentCommand");
var createOneTimePaymentCommand = function (proposalId) { return __awaiter(void 0, void 0, void 0, function () {
    var proposal;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _toolkits_1.prisma.proposal.findUnique({
                    where: {
                        id: proposalId
                    },
                    include: {
                        user: true,
                        join: {
                            include: {
                                card: true,
                                payment: {
                                    where: {
                                        status: {
                                            in: [
                                                client_1.PaymentStatus.Successful,
                                                client_1.PaymentStatus.Pending
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                })];
            case 1:
                proposal = _a.sent();
                // Validate the request
                if (!proposal) {
                    throw new _errors_1.NotFoundError('proposal', proposalId);
                }
                if (!proposal.join) {
                    throw new _errors_1.CommonError('Invalid proposal type');
                }
                if (proposal.join.fundingType !== client_1.FundingType.OneTime) {
                    throw new _errors_1.CommonError('Invalid funding type');
                }
                if (proposal.join.payment.length) {
                    throw new _errors_1.CommonError('Cannot create new payment for one time proposal', {
                        payments: proposal.join.payment
                    });
                }
                // Create the local payment and return it
                return [2 /*return*/, createPaymentCommand_1.createPaymentCommand({
                        connect: {
                            commonId: proposal.commonId,
                            cardId: proposal.join.card.id,
                            joinId: proposal.join.id,
                            userId: proposal.user.id
                        },
                        metadata: {
                            ipAddress: proposal.ipAddress || '127.0.0.1',
                            email: proposal.user.email
                        },
                        type: client_1.PaymentType.OneTimePayment,
                        amount: proposal.join.funding,
                        circleCardId: proposal.join.card.circleCardId
                    })];
        }
    });
}); };
exports.createOneTimePaymentCommand = createOneTimePaymentCommand;
