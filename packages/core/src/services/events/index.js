"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsService = void 0;
var createEvent_1 = require("./commands/createEvent");
exports.eventsService = {
    create: createEvent_1.createEventCommand
};
