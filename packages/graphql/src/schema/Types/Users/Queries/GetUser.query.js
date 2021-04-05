"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserQuery = void 0;
var nexus_1 = require("nexus");
exports.GetUserQuery = nexus_1.extendType({
    type: 'Query',
    definition: function (t) {
        t.crud.user();
    }
});
