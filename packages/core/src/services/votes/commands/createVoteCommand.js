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
exports.createVoteCommand = void 0;
var z = __importStar(require("zod"));
var client_1 = require("@prisma/client");
var worker_1 = require("@common/worker");
var _services_1 = require("@services");
var _errors_1 = require("@errors");
var _toolkits_1 = require("@toolkits");
var schema = z.object({
    userId: z.string()
        .nonempty(),
    proposalId: z.string()
        .nonempty()
        .uuid(),
    outcome: z.enum(Object.keys(client_1.VoteOutcome))
});
var createVoteCommand = function (command) { return __awaiter(void 0, void 0, void 0, function () {
    var proposal, commonId, memberId, vote, e_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, _toolkits_1.prisma.proposal.findMany({
                    where: {
                        id: command.proposalId
                    },
                    select: {
                        id: true,
                        commonId: true
                    }
                })];
            case 1:
                proposal = (_b.sent())[0];
                if (!proposal) {
                    throw new _errors_1.NotFoundError('proposal', command.proposalId);
                }
                commonId = proposal.commonId;
                return [4 /*yield*/, _services_1.commonService.getMemberId(command.userId, commonId)];
            case 2:
                memberId = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, _toolkits_1.prisma.vote.create({
                        data: {
                            commonMemberId: memberId,
                            outcome: command.outcome,
                            proposalId: proposal.id
                        }
                    })];
            case 4:
                vote = _b.sent();
                return [3 /*break*/, 6];
            case 5:
                e_1 = _b.sent();
                // We are here so the user has most likely already voted for this proposals. Check to be sure
                if ((_a = e_1.message) === null || _a === void 0 ? void 0 : _a.includes('Unique constraint failed on the fields: (`commonMemberId`,`proposalId`)')) {
                    throw new _errors_1.CommonError('Only one vote is allowed from member per proposal');
                }
                else {
                    // Some other error occurred, so just rethrow it
                    throw e_1;
                }
                return [3 /*break*/, 6];
            case 6: 
            // Create event for the creation of the vote
            return [4 /*yield*/, _services_1.eventService.create({
                    type: client_1.EventType.VoteCreated,
                    userId: command.userId,
                    commonId: commonId
                })];
            case 7:
                // Create event for the creation of the vote
                _b.sent();
                // Add the proposal vote count update to the queue
                worker_1.worker.addVotesJob('processVote', vote.id);
                // Return the created vote
                return [2 /*return*/, vote];
        }
    });
}); };
exports.createVoteCommand = createVoteCommand;
