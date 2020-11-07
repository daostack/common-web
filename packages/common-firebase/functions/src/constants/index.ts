import merge from 'deepmerge';

import adminKeys from './env/adminsdk-keys.json';
import envSecrets from './env/env_secrets.json';
import envConfig from './env/env_config.json';

interface Env {
  environment: 'staging' | 'production' | 'dev';

  firebase: {
    databaseURL: string;
    apiKey: string;
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

export const StatusCodes = {
  InternalServerError: 500,

  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  UnprocessableEntity: 422,

  Ok: 200
}

export const ErrorCodes = {
  NotFound: 'NotFound',

  GenericError: 'GenericError',
  UncaughtError: 'UncaughtError',
  ValidationError: 'ValidationError',
  ArgumentError: 'ArgumentError',
  ArgumentNullError: 'ArgumentNullError',
  AuthenticationError: 'AuthenticationError',

  // ---- External providers errors
  CirclePayError: 'External.CirclePayError'
}

export const ProposalTypes = {
  Join: 'join',
  Funding: 'fundingRequest'
}

// ---- Reexports
export { runtimeOptions } from './runtimeOptions';
export { Collections } from './collections';

export { adminKeys };
