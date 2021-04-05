"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateScalar = void 0;
var graphql_1 = require("graphql");
var nexus_1 = require("nexus");
exports.DateScalar = nexus_1.scalarType({
    name: 'Date',
    asNexusMethod: 'date',
    parseValue: function (value) {
        return new Date(value);
    },
    serialize: function (value) {
        if (!(value instanceof Date)) {
            value = new Date(value);
        }
        return value === null || value === void 0 ? void 0 : value.getTime();
    },
    parseLiteral: function (ast) {
        if (ast.kind === graphql_1.Kind.INT) {
            return new Date(ast.value);
        }
        return null;
    }
});
