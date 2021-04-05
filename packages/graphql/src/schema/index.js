"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
var path_1 = __importDefault(require("path"));
var nexus_1 = require("nexus");
var nexus_plugin_prisma_1 = require("nexus-plugin-prisma");
var Users_1 = require("./Types/Users");
var Cards_1 = require("./Types/Cards");
var Votes_1 = require("./Types/Votes");
var Commons_1 = require("./Types/Commons");
var Proposals_1 = require("./Types/Proposals");
var Date_scalar_1 = require("./Shared/Scalars/Date.scalar");
var Link_type_1 = require("./Shared/Types/Link.type");
var BillingDetails_input_1 = require("./Shared/Inputs/BillingDetails.input");
var types = [
    Users_1.UserTypes,
    Cards_1.CardTypes,
    Votes_1.VoteTypes,
    Commons_1.CommonTypes,
    Proposals_1.ProposalTypes,
    // Scalars
    Date_scalar_1.DateScalar,
    // Shared Types
    Link_type_1.LinkType,
    // Shared Input Types
    Link_type_1.LinkInputType,
    BillingDetails_input_1.BillingDetailsInput
];
exports.schema = nexus_1.makeSchema({
    types: types,
    outputs: {
        typegen: path_1.default.join(__dirname, '../generated/', 'nexus-typegen.ts'),
        schema: path_1.default.join(__dirname, '../generated/', 'schema.graphql')
    },
    contextType: {
        module: path_1.default.join(__dirname, '../context'),
        export: 'IRequestContext'
    },
    plugins: [
        nexus_plugin_prisma_1.nexusPrisma({
            experimentalCRUD: true,
            outputs: {
                typegen: path_1.default.join(__dirname, '../generated/', 'nexus-prisma-typegen.ts')
            }
        })
    ]
});
