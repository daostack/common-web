"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonTypes = void 0;
var Common_type_1 = require("./Types/Common.type");
var FundingTypeEnum_1 = require("./Enums/FundingTypeEnum");
var CreateCommon_mutation_1 = require("./Mutations/CreateCommon.mutation");
var GetCommon_query_1 = require("./Queries/GetCommon.query");
var GetCommons_query_1 = require("./Queries/GetCommons.query");
exports.CommonTypes = [
    Common_type_1.CommonType,
    GetCommon_query_1.GetCommonQuery,
    GetCommons_query_1.GetCommonsQuery,
    FundingTypeEnum_1.FundingTypeEnum,
    CreateCommon_mutation_1.CreateCommonInput,
    CreateCommon_mutation_1.CreateCommonMutation
];
