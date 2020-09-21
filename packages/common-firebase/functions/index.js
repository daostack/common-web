require('module-alias/register')
const {env} = require('@env');
const relayer = require('./relayer');
const graphql = require('./graphql');
const graphqlTriggers = require('./graphql/util/triggers');
const mangopay = require('./mangopay');
const mangopayTriggers = require('./mangopay/triggers');
const create = require('./creation');
// Add the __tests__ endpoints only if enabled
if(env.tests.enabled) {
  exports.tests = require('./tests').tests;
}

exports.relayer = relayer.relayer;
exports.graphql = graphql.graphql;
exports.mangopay = mangopay.mangopay;
exports.mangopaySubs = mangopayTriggers;
exports.graphqlSubs = graphqlTriggers;
exports.graphqlSubs = graphqlTriggers;
exports.create = create.create;

// Disable notification
// exports.notification = require('./notification');

exports.cronJobs = require('./cron').crons;
