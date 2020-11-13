import express from 'express';

import { StatusCodes } from '../constants';
import { ValidationError } from './errors';

interface IResponseExecutorAction {
  (): any;
}

interface IResponseExecutorPayload {
  req: express.Request;
  res: express.Response;
  next: express.NextFunction;
  successMessage: string;
}

interface IResponseExecutor {
  (action: IResponseExecutorAction, payload: IResponseExecutorPayload): Promise<void>
}

export const responseExecutor: IResponseExecutor = async (action, { res, next, successMessage }): Promise<void> => {
  try {
    const actionResult = await action() || {};

    res
      .status(StatusCodes.Ok)
      .json({
        message: successMessage,
        ...actionResult
      });

    return next();
  } catch (e) {
    return next(e);
  }
};