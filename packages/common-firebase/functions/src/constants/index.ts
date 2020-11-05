import merge from 'deepmerge';

import envSecrets from './env/env_secrets.json';
import envConfig from './env/env_config.json';

interface Env {
  environment: 'staging' | 'production';

  firebase: {
    databaseURL: string;
  };

  mail: {
    SENDGRID_API_KEY: string;
  };

  circlepay: {
    apiUrl: string;
    apiKey: string;
  };
}

export const env = merge(envSecrets, envConfig) as Env;

// ---- Reexports
export { runtimeOptions } from './runtimeOptions';
