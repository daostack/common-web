import { ILogger } from './util/logger';

declare global {
  declare namespace Express {
    export interface Request {
      user: {
        uid: string;
      }

      requestId: string;

      ipAddress: string;
    }
  }


  declare namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'dev' | 'production' | 'staging' | 'test';
    }

    interface Global {
      logger: ILogger;
    }
  }

  declare const logger: ILogger;
}