const admin = require('firebase-admin');
const { databaseURL } = require('./settings');

admin.initializeApp({
  credential: admin.credential.cert(require('./_keys/adminsdk-keys.json')),
  databaseURL: databaseURL,
});

exports.relayer = require('./relayer');
exports.graphql = require('./graphql');
exports.notification = require('./notification');
