"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsQueue = void 0;
var bull_1 = __importDefault(require("bull"));
var _constants_1 = require("@constants");
var createEventProcessor_1 = require("./jobs/createEventProcessor");
var EventsQueue = new bull_1.default(_constants_1.Queues.EventsQueue);
exports.EventsQueue = EventsQueue;
createEventProcessor_1.registerCreateEventProcessor(EventsQueue);
