import * as yup from 'yup';

import { CommonError } from './CommonError';
import { ErrorCodes, StatusCodes } from '../../constants';


const handleInner = (err: yup.ValidationError[], includeValues: boolean) => {
  return err.map(err => ({
    field: err.path,
    message: err.message,
    value: includeValues && err.value,
    ...(!(err.inner) && handleInner(err.inner, includeValues))
  }));
};

/**
 * The validation error occurs if an input value does not match
 * the expected data type, range or pattern of the data field.
 */
export class ValidationError extends CommonError {
  constructor(validationError: yup.ValidationError, includeValues = true) {
    super('Validation failed', {
      userMessage: 'The request cannot be processed, because the validation failed',
      statusCode: StatusCodes.UnprocessableEntity,
      errorCode: ErrorCodes.ValidationError,

      errors: validationError.errors,
      detailedErrors: handleInner(validationError.inner, includeValues)
    });
  }
}