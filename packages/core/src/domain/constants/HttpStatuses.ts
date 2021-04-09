import { GenericError, NotImplementedError, NotFoundError } from './ErrorCodes';

export const GenericErrorStatus = 500;

export const NotFoundErrorStatus = 404;

export const HttpStatuses = {
  UnprocessableEntity: 422,

  InternalServerError: 500,

  [GenericError]: GenericErrorStatus,
  [NotImplementedError]: GenericErrorStatus,

  [NotFoundError]: NotFoundErrorStatus
};