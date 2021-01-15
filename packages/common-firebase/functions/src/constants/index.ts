import merge from 'deepmerge';

import adminKeys from './env/adminsdk-keys.json';
import envSecrets from './env/env_secrets.json';
import envConfig from './env/env_config.json';

interface Env {
  environment: 'staging' | 'production' | 'dev';

  firebase: {
    databaseURL: string;
  };

  metadata: {
    app: {
      currentVersion: string;
      oldestSupportedVersion: string;
    }
  };

  mail: {
    SENDGRID_API_KEY: string;

    sender: string;
    payoutEmail: string;
    adminMail: string;
  };

  circlepay: {
    apiUrl: string;
    apiKey: string;
  };

  durations: {
    funding: {
      countdownPeriod: number;
      quietEndingPeriod: number;
    };

    join: {
      countdownPeriod: number;
      quietEndingPeriod: number;
    };
  }

  endpoints: {
    base: string;
    notifications: string;
  }

  secretManagerProject: string;
  local: string;

  payouts: {
    approvers: string[];
    neededApprovals: number;
  }

  backoffice: {
    sheetUrl: string;
  }
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
};

export const ErrorCodes = {
  NotFound: 'NotFound',

  GenericError: 'GenericError',
  UncaughtError: 'UncaughtError',
  ValidationError: 'ValidationError',
  ArgumentError: 'ArgumentError',
  ArgumentNullError: 'ArgumentNullError',
  AuthenticationError: 'AuthenticationError',

  CvvVerificationFail: 'CvvVerificationFail',

  // ---- External providers errors
  CirclePayError: 'External.CirclePayError'
};

export const ProposalTypes = {
  Join: 'join',
  Funding: 'fundingRequest'
};

export const ProposalActiveStates = [
  'countdown'
];

export const ProposalFinalStates = [
  'passed',
  'failed'
];

// ---- Reexports
export { runtimeOptions } from './runtimeOptions';
export { Collections } from './collections';
export { Notifications } from './notifications';

export { adminKeys };
