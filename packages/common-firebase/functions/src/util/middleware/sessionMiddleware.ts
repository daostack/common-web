import express from 'express';
import { v4 } from 'uuid';


export const sessions = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  req.sessionId = v4();

  next();
};
