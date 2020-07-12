const merge = require('deepmerge');
const envSecrets = require('./env_secrets.json');
const envConfig = require('./env_config.json');

const env = merge(envSecrets, envConfig);

exports.env = env;
