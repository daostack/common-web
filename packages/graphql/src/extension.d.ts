declare global {
  declare namespace Express {
    export interface Request {
      /**
       * Unique ID for each request made
       */
      requestId: string;

      /**
       * The IP address, parsed from the AppEngine headers or
       * 127.0.0.1 if unable to do so
       */
      clientIp: string;
    }
  }
}