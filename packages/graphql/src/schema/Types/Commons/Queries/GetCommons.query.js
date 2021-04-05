"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommonsQuery = void 0;
var nexus_1 = require("nexus");
exports.GetCommonsQuery = nexus_1.extendType({
    type: 'Query',
    definition: function (t) {
        t.crud.commons({
            filtering: true
        });
    }
});
