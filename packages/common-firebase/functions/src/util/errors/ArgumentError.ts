import { CommonError } from './CommonError';
import { ErrorCodes, StatusCodes } from '../../constants';

/**
 * The exception that is thrown when one of the arguments provided to a
 * method is not valid or when a method is invoked and at least one
 * of the passed arguments is null but should never be null.
 */
export class ArgumentError extends CommonError {
  constructor(argument: string, argumentValue?: string) {
    super(`An argument (${argument}) error occurred!`, {
      argument,
      argumentValue,

      statusCode: StatusCodes.InternalServerError,
      errorCode:
        argumentValue
          ? ErrorCodes.ArgumentError
          : ErrorCodes.ArgumentNullError
    });
  }
}