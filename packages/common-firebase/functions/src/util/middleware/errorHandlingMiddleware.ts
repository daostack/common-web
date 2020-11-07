import express from 'express';

import { CommonError } from '../errors';
import { createErrorResponse } from '../createErrorResponse';
import { ICommonError } from '../errors/CommonError';

export const errorHandling = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if ((err as ICommonError).errorId) {
    createErrorResponse(req, res, err as ICommonError);
  } else {
    console.error('Error that is not CommonError occurred. Raw error: ', err);

    createErrorResponse(req, res, new CommonError(
      err.message || err as unknown as string || 'Something bad happened',
      {
        error: err,
        errorString: JSON.stringify(err)
      }
    ));
  }

  next();
};
