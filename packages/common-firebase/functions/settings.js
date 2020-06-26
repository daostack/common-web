
const env = require('./env/env.json')

const graphHttpLink = env.graphql.httpLink;
const graphwsLink = env.graphql.websocket;
const databaseURL = env.firebase.databaseURL;
const jsonRpcProvider = env.blockchain.jsonRpcProvider;
const mangoPayApi = env.mangopay.apiUrl;

module.exports = {
    graphwsLink,
    graphHttpLink,
    databaseURL,
    jsonRpcProvider,
    mangoPayApi
}
