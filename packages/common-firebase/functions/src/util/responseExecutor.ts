import express from 'express';

import { StatusCodes } from '../constants';

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
    let actionResult = await action();

    // console.log(`ActionResult --> ${actionResult}`);

    if (!actionResult) {
      actionResult = {};
    }

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

interface IResponseCreateExecutor {
  (action: IResponseExecutorAction, payload: IResponseExecutorPayload, retried?: boolean): Promise<void>
}

export const responseCreateExecutor: IResponseCreateExecutor = async (action, { req, res, next, successMessage }, retried = false): Promise<void> => {
  try {
    let actionResult = await action();

    if (!actionResult) {
      actionResult = {};
    }

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