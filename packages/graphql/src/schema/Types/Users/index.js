"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypes = void 0;
var User_type_1 = require("./Types/User.type");
var GetUser_query_1 = require("./Queries/GetUser.query");
var GenerateUserAuthToken_query_1 = require("./Queries/GenerateUserAuthToken.query");
var CreateUser_mutation_1 = require("./Mutations/CreateUser.mutation");
exports.UserTypes = [
    User_type_1.UserType,
    GetUser_query_1.GetUserQuery,
    CreateUser_mutation_1.CreateUserInput,
    CreateUser_mutation_1.CreateUserMutation,
    // Do not let me slip this into production
    GenerateUserAuthToken_query_1.GenerateUserAuthTokenQuery
];
