import * as uuid from 'uuid';

import { ErrorCodes, HttpStatuses } from '@constants';
import { logger } from '@logger';

interface IErrorData {
  userMessage?: string;
  statusCode?: number;
  errorCode?: string;
  name?: string;

  [key: string]: any;
}

export interface ICommonError {
  name: string;
  message: string;
  errorId: string;
  errorCode: string;
  userMessage: string;
  statusCode: number;
  data: any;
}

/**
 * The base error of the project. All other errors must be derived
 * from the CommonError and in all cases, for witch we do
 * no have custom error the CommonError must be used
 */
export class CommonError extends Error implements ICommonError {
  public errorId: string;
  public errorCode: string;
  public userMessage: string;
  public statusCode: number;
  public name: string;
  public data: any;

  /**
   * Creates new common error
   *
   * @param message - the error message (required)
   * @param data - more data, related to the error (optional)
   */
  constructor(
    message: string,
    data: IErrorData = {}
  ) {
    const errorId = uuid.v4();
    super(`${message} (${errorId})`);

    Error.captureStackTrace(this, this.constructor);

    this.errorId = errorId;

    this.name = data.name || 'Common Error';
    this.errorCode = data.errorCode || ErrorCodes.GenericError;
    this.statusCode = data.statusCode || HttpStatuses[ErrorCodes.GenericError];
    this.userMessage = data.userMessage || 'Something bad happened.';

    this.data = data;

    logger.error('New error occurred', {
      error: this
    });
  }
}
