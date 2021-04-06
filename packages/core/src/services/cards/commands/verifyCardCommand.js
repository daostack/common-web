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
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCardCommand = void 0;
var client_1 = require("@prisma/client");
var _clients_1 = require("@clients");
var _utils_1 = require("@utils");
var _toolkits_1 = require("@toolkits");
var _services_1 = require("@services");
var _errors_1 = require("@errors");
var defaultOptions = {
    deleteOnFailure: false,
    throwOnFailure: false
};
/**
 * Does polling on the passed card until CVV and AVS verifications are in terminal states
 *
 * @param card          - The card to verify
 * @param customOptions - Options, modifying the command behaviour
 *
 * @throws { CvvVerificationCheckError } - If selected in options and the CVV check fails
 * @throws { AvsVerificationCheckError } - If selected in options and the AVS check fails
 *
 * @returns - Boolean, identifying whether the check was successful or not
 */
var verifyCardCommand = function (card, customOptions) { return __awaiter(void 0, void 0, void 0, function () {
    var options, pollAction, pollValidator, circleCard, cvvCheck;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = __assign(__assign({}, defaultOptions), customOptions);
                pollAction = function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, _clients_1.circleClient.cards.get(card.circleCardId)];
                            case 1: return [2 /*return*/, (_a.sent()).data];
                        }
                    });
                }); };
                pollValidator = function (card) {
                    return card.verification.avs !== 'pending' && card.verification.cvv !== 'pending';
                };
                return [4 /*yield*/, _utils_1.poll(pollAction, pollValidator)];
            case 1:
                circleCard = _a.sent();
                if (!(circleCard.verification.cvv !== card.cvvCheck)) return [3 /*break*/, 8];
                cvvCheck = circleCard.verification.cvv;
                if (!(cvvCheck !== 'pending' &&
                    cvvCheck !== 'unavailable')) return [3 /*break*/, 3];
                return [4 /*yield*/, _services_1.eventService.create({
                        userId: card.userId,
                        type: cvvCheck === 'fail'
                            ? client_1.EventType.CardCvvVerificationFailed
                            : client_1.EventType.CardCvvVerificationPassed
                    })];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                if (!(options.deleteOnFailure && cvvCheck === 'fail')) return [3 /*break*/, 5];
                return [4 /*yield*/, _toolkits_1.prisma.card.delete({
                        where: {
                            id: card.id
                        }
                    })];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, _toolkits_1.prisma.card.update({
                    where: {
                        id: card.id
                    },
                    data: {
                        cvvCheck: cvvCheck
                    }
                })];
            case 6:
                card = _a.sent();
                _a.label = 7;
            case 7:
                // Throw error if requested
                if (options.throwOnFailure && cvvCheck === 'fail') {
                    throw new _errors_1.CvvVerificationCheckError(card.id);
                }
                _a.label = 8;
            case 8: 
            // @todo Do the AVS check
            return [2 /*return*/, circleCard.verification.cvv !== 'fail'];
        }
    });
}); };
exports.verifyCardCommand = verifyCardCommand;
