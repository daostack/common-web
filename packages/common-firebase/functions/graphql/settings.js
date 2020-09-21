const { env } = require('@env');
const settings = require('../settings');

const { graphql } = env;

/**
 * Get the current application settings
 *
 * @param {e.Request}  req - the express request
 *
 * @returns {{
 *  currentEnvironment: string
 * }}
 */
const getPublicSettings = (req) => {
  return {
    currentEnvironment: env.environment,
    testsEndpointEnabled: env.tests.enabled,


    blockchain: {
      jsonRpcProvider: env.blockchain.jsonRpcProvider,
      chainId: env.blockchain.chainId
    },

    graphql: {
      subgraph: graphql.subgraphName,
      httpProvider: graphql.graphqlHttpProvider,
      wsProvider: graphql.graphqlWsProvider,
      ipfsDataVersion: graphql.ipfsDataVersion
    }
  };
};

module.exports = {
  getPublicSettings
}