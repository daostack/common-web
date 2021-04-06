"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventService = void 0;
var createEventCommand_1 = require("./commands/createEventCommand");
var _createEventCommand_1 = require("./commands/$createEventCommand");
var processEventCommand_1 = require("./commands/processEventCommand");
exports.eventService = {
    create: createEventCommand_1.createEventCommand,
    $create: _createEventCommand_1.$createEventCommand,
    process: processEventCommand_1.processEventCommand
};
