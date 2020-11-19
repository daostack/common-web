declare namespace Express {
  export interface Request {
    user: {
      uid: string;
    }

    sessionId: string;
  }
}


declare namespace NodeJS
{
  export interface ProcessEnv
  {
    NODE_ENV: "dev" | "production" | "staging" | 'test';
  }
}
