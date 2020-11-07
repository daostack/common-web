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