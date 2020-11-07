import express from 'express';
import { stringify } from 'flatted';


import { ErrorCodes, StatusCodes } from '../../constants';
import { CommonError } from './CommonError';

export class UnauthorizedError extends CommonError {
  constructor(req?: express.Request, rest?: any) {
    super('Unauthorized request was made', {
      req: {
        headers: req?.headers,
        query: req?.query,
        body: req?.body
      },
      rest,

      statusCode: StatusCodes.Unauthorized,
      errorCode: ErrorCodes.AuthenticationError
    });
  }
}