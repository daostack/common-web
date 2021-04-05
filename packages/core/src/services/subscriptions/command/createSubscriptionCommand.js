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
exports.createSubscriptionCommand = void 0;
var client_1 = require("@prisma/client");
var _toolkits_1 = require("@toolkits");
var _logger_1 = require("@logger");
var _errors_1 = require("@errors");
var createSubscriptionPaymentCommand_1 = require("../../payments/commands/createSubscriptionPaymentCommand");
/**
 * Creates new subscription and the initial charge for it
 *
 * @param proposalId - The ID of the proposal that we are creating subscription for.
 *    It MUST not have subscription already created for it
 */
var createSubscriptionCommand = function (proposalId) { return __awaiter(void 0, void 0, void 0, function () {
    var logger, proposal, subscription;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger = _logger_1.logger.child({
                    functionName: 'createSubscriptionCommand',
                    params: {
                        proposalId: proposalId
                    }
                });
                return [4 /*yield*/, _toolkits_1.prisma.proposal.findUnique({
                        where: {
                            id: proposalId
                        },
                        include: {
                            join: true
                        }
                    })];
            case 1:
                proposal = _a.sent();
                if (!proposal || !proposal.join) {
                    throw new _errors_1.NotFoundError('join.proposalId', proposalId);
                }
                // Check if it is for subscription common
                if (proposal.join.fundingType !== client_1.FundingType.Monthly) {
                    throw new _errors_1.CommonError('Cannot create subscription for proposal that is not of Monthly funding type', {
                        proposal: proposal
                    });
                }
                // Check the status of it
                if (proposal.state !== client_1.ProposalState.Accepted) {
                    throw new _errors_1.CommonError('Cannot create subscription for proposal that is not approved');
                }
                return [4 /*yield*/, _toolkits_1.prisma.subscription.count({
                        where: {
                            join: {
                                id: proposal.join.id
                            }
                        }
                    })];
            case 2:
                // Check if it already has subscription
                if (_a.sent()) {
                    throw new _errors_1.CommonError('Cannot create subscription because there is already one created for this proposal');
                }
                return [4 /*yield*/, _toolkits_1.prisma.subscription.create({
                        data: {
                            dueDate: new Date(),
                            amount: proposal.join.funding,
                            userId: proposal.userId,
                            cardId: proposal.join.cardId,
                            commonId: proposal.commonId,
                            join: {
                                connect: {
                                    id: proposal.join.id
                                }
                            }
                        }
                    })];
            case 3:
                subscription = _a.sent();
                logger.info('Successfully created subscription', {
                    subscription: subscription
                });
                // Create the initial payment
                return [4 /*yield*/, createSubscriptionPaymentCommand_1.createSubscriptionPaymentCommand(subscription.id)];
            case 4:
                // Create the initial payment
                _a.sent();
                return [2 /*return*/, subscription];
        }
    });
}); };
exports.createSubscriptionCommand = createSubscriptionCommand;
