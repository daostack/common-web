"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createFundingProposalCommand = void 0;
var z = __importStar(require("zod"));
var client_1 = require("@prisma/client");
var _validation_1 = require("@validation");
var _errors_1 = require("@errors");
var _toolkits_1 = require("@toolkits");
var index_1 = require("../../../index");
var generateProposalExpiresAtDate_1 = require("../../helpers/generateProposalExpiresAtDate");
var expireProposalsQueue_1 = require("../../queue/expireProposalsQueue");
var schema = z.object({
    commonId: z.string()
        .uuid()
        .nonempty(),
    proposerId: z.string()
        .nonempty(),
    title: z.string()
        .nonempty(),
    description: z.string()
        .nonempty(),
    amount: z.number()
        .nonnegative(),
    links: z.array(_validation_1.ProposalLinkSchema)
        .optional()
        .nullable(),
    images: z.array(_validation_1.ProposalImageSchema)
        .optional()
        .nullable(),
    files: z.array(_validation_1.ProposalFileSchema)
        .optional()
        .nullable()
});
var createFundingProposalCommand = function (command) { return __awaiter(void 0, void 0, void 0, function () {
    var common, proposal;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // Validate the command
                schema.parse(command);
                return [4 /*yield*/, _toolkits_1.prisma.common.findUnique({
                        where: {
                            id: command.commonId
                        },
                        select: {
                            balance: true,
                            members: {
                                where: {
                                    userId: command.proposerId
                                },
                                select: {
                                    id: true
                                }
                            }
                        }
                    })];
            case 1:
                common = _a.sent();
                // Check if the common is found
                if (common === null) {
                    throw new _errors_1.NotFoundError('common', command.commonId);
                }
                // Check if the user is part of the common
                if (common.members.length === 0) {
                    throw new _errors_1.CommonError('Non member tried to create a funding proposal', {
                        userMessage: 'You can only create funding request in commons that you are member of.',
                        commonId: command.commonId,
                        userId: command.proposerId,
                        command: command
                    });
                }
                // Check the requested amount against the current balance of the common
                if (common.balance < command.amount) {
                    throw new _errors_1.CommonError('Not enough balance for funding proposal', {
                        userMessage: "You cannot request more funds than there are currently available.",
                        command: command,
                        common: common
                    });
                }
                return [4 /*yield*/, _toolkits_1.prisma.proposal.create({
                        data: {
                            title: command.title,
                            description: command.description,
                            type: client_1.ProposalType.FundingRequest,
                            link: command.links,
                            files: command.files,
                            images: command.images,
                            expiresAt: generateProposalExpiresAtDate_1.generateProposalExpiresAtDate(client_1.ProposalType.FundingRequest),
                            user: {
                                connect: {
                                    id: command.proposerId
                                }
                            },
                            common: {
                                connect: {
                                    id: command.commonId
                                }
                            },
                            commonMember: {
                                connect: {
                                    id: common.members[0].id
                                }
                            },
                            funding: {
                                create: {
                                    amount: command.amount
                                }
                            }
                        }
                    })];
            case 2:
                proposal = _a.sent();
                // Create event
                return [4 /*yield*/, index_1.eventService.create({
                        userId: command.proposerId,
                        commonId: command.commonId,
                        type: client_1.EventType.FundingRequestCreated
                    })];
            case 3:
                // Create event
                _a.sent();
                // Set up expiration for the proposal
                expireProposalsQueue_1.addExpireProposalJob(proposal);
                // Return the created funding proposal
                return [2 /*return*/, proposal];
        }
    });
}); };
exports.createFundingProposalCommand = createFundingProposalCommand;
