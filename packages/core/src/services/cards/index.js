"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardsService = void 0;
var createCardCommand_1 = require("./commands/createCardCommand");
var isCardOwnerQuery_1 = require("./queries/isCardOwnerQuery");
exports.cardsService = {
    create: createCardCommand_1.createCardCommand,
    isCardOwner: isCardOwnerQuery_1.isCardOwnerQuery
};
