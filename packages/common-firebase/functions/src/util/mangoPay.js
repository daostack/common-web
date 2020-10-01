const mangopay = require('mangopay2-nodejs-sdk');
const { env } = require('@env');

const mangopayClient = new mangopay({
  clientId: env.mangopay.clientId,
  clientApiKey: env.mangopay.apiKey,

  // Set this base url when using it in production.
  // By default the sandbox api is used
  // baseUser: 'https://api.mangopay.com'
});

module.exports = {
  mangopayClient
};
