const admin = require('firebase-admin');
const { databaseURL } = require('./settings');

admin.initializeApp({
  credential: admin.credential.cert(require('./_keys/adminsdk-keys.json')),
  databaseURL: databaseURL,
});

const relayer = require('./relayer');
const graphql = require('./graphql');

exports.relayer = relayer.relayer; 
exports.graphql = graphql.graphql;
exports.notification = require('./notification');
