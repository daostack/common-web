"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingTypeEnum = void 0;
var nexus_1 = require("nexus");
var client_1 = require("@prisma/client");
exports.FundingTypeEnum = nexus_1.enumType({
    name: 'FundingType',
    description: 'The funding type of the common',
    members: client_1.FundingType
});
