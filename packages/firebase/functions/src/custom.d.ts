import { ILogger } from './util/logger';

declare global {
  declare namespace Express {
    export interface Request {
      user: {
        uid: string;
      }

      /**
       * Unique ID for each request made
       */
      requestId: string;

      /**
       * The IP address, parsed from the AppEngine headers or
       * 127.0.0.1 if unable to do so
       */
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