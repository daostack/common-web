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
exports.updatePaymentStatusCommand = void 0;
var _toolkits_1 = require("@toolkits");
var _clients_1 = require("@clients");
var _logger_1 = require("@logger");
var helpers_1 = require("../helpers");
var updatePaymentStatusCommand = function (paymentId) { return __awaiter(void 0, void 0, void 0, function () {
    var logger, initialPayment, circlePayment, updatedPayment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                logger = _logger_1.logger.child({
                    functionName: 'updatePaymentStatusCommand',
                    payload: {
                        paymentId: paymentId
                    }
                });
                return [4 /*yield*/, _toolkits_1.prisma.payment.findUnique({
                        where: {
                            id: paymentId
                        }
                    })];
            case 1:
                initialPayment = (_a.sent());
                return [4 /*yield*/, _clients_1.circleClient.payments.get(initialPayment.circlePaymentId)];
            case 2:
                circlePayment = _a.sent();
                updatedPayment = initialPayment;
                if (!(initialPayment.circlePaymentStatus !== circlePayment.data.status)) return [3 /*break*/, 4];
                logger.info('Payment status change occurred', {
                    previousStatus: initialPayment.circlePaymentStatus,
                    newStatus: circlePayment.data.status
                });
                return [4 /*yield*/, _toolkits_1.prisma.payment.update({
                        where: {
                            id: paymentId
                        },
                        data: {
                            status: helpers_1.convertCirclePaymentStatus(circlePayment.data.status),
                            circlePaymentStatus: circlePayment.data.status
                        }
                    })];
            case 3:
                updatedPayment = _a.sent();
                _a.label = 4;
            case 4: 
            // @todo If the payment is not finalized schedule job for retrying the update
            // Return the result
            return [2 /*return*/, {
                    initialPayment: initialPayment,
                    updatedPayment: updatedPayment,
                    statusChange: initialPayment.status !== updatedPayment.status
                }];
        }
    });
}); };
exports.updatePaymentStatusCommand = updatePaymentStatusCommand;
