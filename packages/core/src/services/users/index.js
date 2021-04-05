"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
var createUserCommand_1 = require("./commands/createUserCommand");
var userExistsQuery_1 = require("./queries/userExistsQuery");
var getUserIdQuery_1 = require("./queries/getUserIdQuery");
exports.userService = {
    commands: {
        /**
         * @todo Write docs
         */
        create: createUserCommand_1.createUserCommand
    },
    queries: {
        /**
         * @todo Write docs
         */
        exists: userExistsQuery_1.userExistsQuery,
        /**
         * @todo Write docs
         */
        getId: getUserIdQuery_1.getUserIdQuery
    }
};
