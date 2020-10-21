import express from 'express';

import { getArc } from '../settings';
import { StatusCodes } from './constants';
import { CommonError, ICommonError } from './errors/CommonError';

interface IErrorResponse {
  error: string;
  errorId?: string;
  errorName?: string;
  errorCode?: string;
  errorMessage?: string;
  request?: any;
  data?: any;
}

const createErrorResponse = (res: express.Response, req: express.Request, error: ICommonError): void => {
  if(error instanceof CommonError) {
    const errorResponse: IErrorResponse = {
      error: error.message,
      errorName: error.name,
      errorId: error.errorId,
      errorCode: error.errorCode,
      errorMessage: error.userMessage,
      request: {
        body: req.body,
        query: req.query,
        headers: req.headers
      },
      data: error.data
    };

    const statusCode =
      error.statusCode ||
      StatusCodes.InternalServerError;

    console.error(
      `Creating error response with message '${error.message}' for error (${error.errorId || 'No id available'})`,
      errorResponse,
      error
    );

    res
      .status(statusCode)
      .send(errorResponse);
  } else {
    console.log(error)
    console.log(error.message)
    res
      .status(StatusCodes.InternalServerError)
      .send(error?.message || error || 'Something bad happened');
  }
};

interface IResponseExecutorAction {
  (): any;
}

interface IResponseExecutorPayload {
  req: express.Request;
  res: express.Response;
  successMessage: string;
}

interface IResponseExecutor {
  (action: IResponseExecutorAction, payload: IResponseExecutorPayload): Promise<void>
}

export const responseExecutor: IResponseExecutor = async (action, { req, res, successMessage }): Promise<void> => {
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
  } catch (e) {
    console.error(`Error occurred in response`, e)
    createErrorResponse(res, req, e);
  }
};

interface IResponseCreateExecutor {
  (action: IResponseExecutorAction, payload: IResponseExecutorPayload, retried?: boolean): Promise<void>
}

export const responseCreateExecutor: IResponseCreateExecutor = async (action, { req, res, successMessage }, retried = false): Promise<void> => {
  const arc = await getArc();

  try {
    let actionResult = await action();

    console.log(actionResult);

    if (!actionResult) {
      actionResult = {};
    }

    res
      .status(StatusCodes.Ok)
      .json({
        message: successMessage,
        ...actionResult
      });
  } catch (e) {
    if (e.message.match('^No contract with address') && !retried) {

      // @todo Type the arc if possible
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await arc.fetchAllContracts(false);

      console.log('<--- No contract with address error, updating new arc --->');

      await responseCreateExecutor(action, {
        req,
        res,
        successMessage
      }, true);

      return;
    }

    createErrorResponse(res, req, e);
  }
};