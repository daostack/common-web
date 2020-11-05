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

    sender: string;
    adminMail: string;
  };

  circlepay: {
    apiUrl: string;
    apiKey: string;
  };
}

export const env = merge(envConfig, envSecrets) as Env;

// ---- Reexports
export { runtimeOptions } from './runtimeOptions';
export { Collections } from './collections';
