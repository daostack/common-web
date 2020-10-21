// const merge = require('deepmerge');
import merge from 'deepmerge';

import envSecrets from './env_secrets.json';
import envConfig from './env_config.json';

export const env = merge(envSecrets, envConfig) as any;