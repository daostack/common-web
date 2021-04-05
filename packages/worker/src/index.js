"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.worker = void 0;
var express_1 = __importDefault(require("express"));
var bull_board_1 = require("bull-board");
var jobs_1 = require("./jobs");
var core_1 = require("@common/core");
var app = express_1.default();
app.use('/queues/dashboard', bull_board_1.router);
app.listen(4001, function () {
    core_1.logger.info('Worker UI started on port 4001');
});
exports.worker = jobs_1.jobs;
