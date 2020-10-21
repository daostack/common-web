import { v4 as uuidv4 } from 'uuid';
import { ErrorCodes } from '../constants';

interface IErrorData {
  statusCode?: number;
  errorCode?: string;

  payload?: any;

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
   * Create new common error
   *
   * @param message - the error message (required)
   * @param userMessage - the error message that the user will see (optional)
   * @param data - more data, related to the error (optional)
   */
  constructor(
    message: string,
    userMessage = 'Something bad happened',
    data: IErrorData = {}
  ) {
    const errorId = uuidv4();
    super(`${message} (${errorId})`);
    Error.captureStackTrace(this, this.constructor);

    this.errorId = errorId;

    this.name = "Common Error";

    this.userMessage = userMessage;
    this.statusCode = data.statusCode;
    this.errorCode = data.errorCode || ErrorCodes.GenericError;
    
    this.data = data.payload;
  }
}