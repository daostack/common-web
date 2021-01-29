import express from 'express';
import * as os from 'os';

import { env } from '../../constants';
import { createErrorResponse } from '../createErrorResponse';

import { CommonError } from '../errors';
import { ICommonError } from '../errors/CommonError';
import { slackClient } from '../slack';

export const errorHandling = async (err: Error, req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
  try {
    // When the functions are running in cloud environment the hostname is just `localhost`. When I ran them
    // locally on my machine the hostname was Alexanders-MBP.lan, so when we have localhost we can be pretty sure
    // that they are running in the cloud. Just as a precaution if the environment is production I send them regardless
    if (os.hostname() === 'localhost' || env.environment === 'production') {
      await slackClient.sendError(err as CommonError, req.requestId);
    } else {
      logger.notice('Error slack notification not send, because the detected environment is not the cloud!');
    }
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
