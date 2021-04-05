"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommonQuery = void 0;
var nexus_1 = require("nexus");
exports.GetCommonQuery = nexus_1.extendType({
    type: 'Query',
    definition: function (t) {
        t.crud.common();
    }
});
