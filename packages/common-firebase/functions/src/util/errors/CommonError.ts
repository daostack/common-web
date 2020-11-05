import { v4 as uuidv4 } from 'uuid';
import { ErrorCodes, StatusCodes } from '../constants';

interface IErrorData {
  userMessage?: string;
  statusCode?: number;
  errorCode?: string;

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
    const errorId = uuidv4();
    super(`${message} (${errorId})`);
    Error.captureStackTrace(this, this.constructor);

    this.errorId = errorId;

    this.name = "Common Error";

    this.errorCode = data.errorCode || ErrorCodes.GenericError;
    this.statusCode = data.statusCode || StatusCodes.InternalServerError;
    this.userMessage = data.userMessage || 'Something bad happened.';

    this.data = data;
  }
}
