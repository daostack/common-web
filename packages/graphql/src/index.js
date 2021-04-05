"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequestContext = exports.schema = void 0;
var schema_1 = require("./schema");
Object.defineProperty(exports, "schema", { enumerable: true, get: function () { return schema_1.schema; } });
var context_1 = require("./context");
Object.defineProperty(exports, "createRequestContext", { enumerable: true, get: function () { return context_1.createRequestContext; } });
var request_ip_1 = __importDefault(require("request-ip"));
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var bull_board_1 = require("bull-board");
var apollo_server_express_1 = require("apollo-server-express");
var src_1 = require("../../graphql/src");
require("@config");
// Initialize the servers
var app = express_1.default();
var apollo = new apollo_server_express_1.ApolloServer({
    schema: src_1.schema,
    context: src_1.createRequestContext
});
// Configure the express app
app.use(cors_1.default());
app.use(request_ip_1.default.mw());
app.use('/queues/dashboard', bull_board_1.router);
// Add the Apollo middleware to the express app
apollo.applyMiddleware({ app: app });
app.listen({ port: 4000 }, function () {
    console.info("\uD83D\uDE80 Server ready");
});
