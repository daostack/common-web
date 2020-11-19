declare namespace Express {
  export interface Request {
    user: {
      uid: string;
    }

    sessionId: string;
  }
}