"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPaymentJob = void 0;
var bull_1 = __importDefault(require("bull"));
var bull_board_1 = require("bull-board");
var Queues_1 = require("../constants/Queues");
var core_1 = require("@common/core");
// Create the queue
var PaymentsQueue = bull_1.default(Queues_1.Queues.PaymentsQueue);
// Setup the queue UI
bull_board_1.setQueues([
    new bull_board_1.BullAdapter(PaymentsQueue)
]);
// Create a way to add jobs
var addPaymentJob = function (job, paymentId, options) {
    core_1.logger.debug('New payment job was added', {
        job: job,
        options: options,
        paymentId: paymentId
    });
    PaymentsQueue.add(job, {
        paymentId: paymentId
    }, __assign({}, options));
};
exports.addPaymentJob = addPaymentJob;
// Process the jobs
PaymentsQueue.process(function (job, done) {
    core_1.logger.error('Unnamed payment job occurred', {
        job: job
    });
    done();
});
PaymentsQueue.process('process', function (job, done) {
    // @todo Create log about the processing
    // @todo
    // @todo Create log about the processing result
});
PaymentsQueue.process('updateStatus', function (job, done) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // @todo Create log about the processing result
                core_1.logger.debug('Starting payment status update job', { job: job });
                return [4 /*yield*/, core_1.paymentService.updateStatus(job.data.paymentId)];
            case 1:
                _a.sent();
                // @todo Create log about the processing
                core_1.logger.debug('Processed payment status update job', { job: job });
                done();
                return [2 /*return*/];
        }
    });
}); });
