import * as yup from 'yup';

import { CommonError } from './CommonError';


const handleInner = (err: yup.ValidationError[], includeValues: boolean) => {
  return err.map(err => ({
    field: err.path,
    message: err.message,
    value: includeValues && err.value,
    ...(!(err.inner) && handleInner(err.inner, includeValues))
  }));
}

export class ValidationError extends CommonError {
  constructor(validationError: yup.ValidationError, includeValues = true) {
    super('Validation failed', {
      statusCode: 422,
      errors: validationError.errors,
      detailedErrors: handleInner(validationError.inner, includeValues)
    });
  }
}