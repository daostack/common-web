const merge = require('deepmerge');

let envSecrets;
const envConfig = require('./env_config.json');

// We need to do this because there are no secrets
// in github actions so the tests fails
try {
  envSecrets = require('./env_secrets.json')
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') {
    throw e;
  }

  console.warn('Env Secrets were not found');
  envSecrets = {};
}

const env = merge(envSecrets, envConfig);

exports.env = env;
