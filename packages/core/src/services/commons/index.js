"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonService = void 0;
var createCommonCommand_1 = require("./command/createCommonCommand");
var createCommonMemberCommand_1 = require("./command/createCommonMemberCommand");
var addCommonMemberRoleCommand_1 = require("./command/addCommonMemberRoleCommand");
var getCommonMemberIdQuery_1 = require("./queries/getCommonMemberIdQuery");
exports.commonService = {
    create: createCommonCommand_1.createCommonCommand,
    createMember: createCommonMemberCommand_1.createCommonMemberCommand,
    addCommonMemberRole: addCommonMemberRoleCommand_1.addCommonMemberRoleCommand,
    getMemberId: getCommonMemberIdQuery_1.getCommonMemberIdQuery
};
