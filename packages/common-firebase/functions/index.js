const admin = require('firebase-admin');
const { databaseURL } = require('./settings');

admin.initializeApp({
  credential: admin.credential.cert(require('./env/adminsdk-keys.json')),
  databaseURL: databaseURL,
});

const relayer = require('./relayer');
const graphql = require('./graphql');
const mangopay = require('./mangopay');
const mangopayTriggers = require('./mangopay/triggers');

exports.relayer = relayer.relayer;
exports.graphql = graphql.graphql;
exports.mangopay = mangopay.mangopay;
exports.mangopaySubs = mangopayTriggers;
exports.notification = require('./notification');
