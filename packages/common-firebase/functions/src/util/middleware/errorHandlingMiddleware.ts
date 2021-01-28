import express from 'express';
import { createErrorResponse } from '../createErrorResponse';

import { CommonError } from '../errors';
import { ICommonError } from '../errors/CommonError';
import { slackClient } from '../slack';

export const errorHandling = async (err: Error, req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    await slackClient.sendError(err as CommonError, req.requestId);
  } catch (e) {
    logger.error('An error occurred while trying to communicate with slack', {
      error: e
    });
  }

  if ((err as ICommonError).errorId) {
    createErrorResponse(req, res, err as ICommonError);
  } else {
    logger.warn('Error that is not CommonError occurred. Raw error: ', err);

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
