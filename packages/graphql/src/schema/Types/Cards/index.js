"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardTypes = void 0;
var Card_type_1 = require("./Types/Card.type");
var CreateCard_mutation_1 = require("./Mutations/CreateCard.mutation");
exports.CardTypes = [
    Card_type_1.CardType,
    CreateCard_mutation_1.CreateCardInput,
    CreateCard_mutation_1.CreateCardMutation
];
