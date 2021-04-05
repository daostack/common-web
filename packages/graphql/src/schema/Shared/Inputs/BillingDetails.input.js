"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingDetailsInput = void 0;
var nexus_1 = require("nexus");
exports.BillingDetailsInput = nexus_1.inputObjectType({
    name: 'BillingDetailsInput',
    definition: function (t) {
        t.nonNull.string('name');
        t.nonNull.string('city');
        t.nonNull.string('country');
        t.nonNull.string('line1');
        t.nonNull.string('postalCode');
        t.string('line2');
        t.string('district');
    }
});
