const ethers = require('ethers');
const { Arc } = require('@daostack/arc.js');

const { env } = require('./env');

const graphHttpLink = env.graphql.httpLink;
const graphwsLink = env.graphql.websocket;
const databaseURL = env.firebase.databaseURL;
const jsonRpcProvider = env.blockchain.jsonRpcProvider;
const mangoPayApi = env.mangopay.apiUrl;

const retryOptions = {
    retries: 4, // The maximum amount of times to retry the operation. Default is 10.
    factor: 2, // The exponential factor to use. Default is 2.
    minTimeout: 1000, //The number of milliseconds before starting the first retry. Default is 1000.
    randomize: false, //Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is false.
};

const provider = new ethers.providers.JsonRpcProvider(jsonRpcProvider);

const arc = new Arc({
  graphqlHttpProvider: graphHttpLink,
  graphqlWsProvider: graphwsLink,
});


module.exports = {
    arc,
    graphwsLink,
    graphHttpLink,
    databaseURL,
    jsonRpcProvider,
    mangoPayApi,
    provider,
    retryOptions
}
