const { env } = require('./env');
const admin = require('firebase-admin');
const { databaseURL } = require('./settings');

admin.initializeApp({
  credential: admin.credential.cert(require('./env/adminsdk-keys.json')),
  databaseURL: databaseURL
});

const relayer = require('./relayer');
const graphql = require('./graphql');
const graphqlTriggers = require('./graphql/triggers');
const mangopay = require('./mangopay');
const mangopayTriggers = require('./mangopay/triggers');

// Add the tests endpoints only if enabled
if(env.tests.enabled) {
  exports.tests = require('./tests').tests;
}

exports.relayer = relayer.relayer;
exports.graphql = graphql.graphql;
exports.mangopay = mangopay.mangopay;
exports.mangopaySubs = mangopayTriggers;
exports.graphqlSubs = graphqlTriggers;
// Disable notification
// exports.notification = require('./notification');
