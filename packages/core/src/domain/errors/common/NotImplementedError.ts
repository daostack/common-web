import { CommonError } from '../index';
import { ErrorCodes, HttpStatuses } from '../../constants/index';

export class NotImplementedError extends CommonError {
  constructor(message: string = 'No message provided') {
    super(`Not Implemented Error: ${message}`, {
      name: 'NotImplementedError',

      errorCode: ErrorCodes.NotImplementedError,
      statusCode: HttpStatuses[ErrorCodes.NotImplementedError]
    });
  }
}