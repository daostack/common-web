import express from 'express';

import { CommonError, ICommonError } from './errors/CommonError';
import { StatusCodes } from '../constants';

export interface IErrorResponse {
  error: string;
  errorId?: string;
  errorName?: string;
  errorCode?: string;
  errorMessage?: string;
  request?: any;
  data?: any;
}

export const createErrorResponse = (req: express.Request, res: express.Response, error: ICommonError): void => {
  console.info(`Error occurred at ${req.path}`);

  // Here `error instanceof CommonError` does not work for some
  // strange reason so for now we can assume that if the error
  // has errorId it is CommonError
  if (error.errorId) {
    const errorResponse: IErrorResponse = {
      error: error.message,
      errorName: error.name,
      errorId: error.errorId,
      errorCode: error.errorCode,
      errorMessage: error.userMessage,
      request: {
        id: req.sessionId,
        body: req.body,
        query: req.query,
        headers: req.headers
      },
      data: error.data
    };

    const statusCode =
      error.statusCode ||
      StatusCodes.InternalServerError;

    console.info(`
      Creating error response with message '${error.message}' 
      for error (${error.errorId || 'No id available'})
      occurred in request ${req.sessionId}
    `);

    console.error(error);


    res
      .status(statusCode)
      .json(errorResponse);
  } else {
    console.error(
      new CommonError(`
        The error passed to createErrorResponse was not of
        CommonError type. This should never happen!
      `, {
        payload: error
      })
    );

    res
      .status(StatusCodes.InternalServerError)
      .send(error?.message || error || 'Something bad happened');
  }
};
