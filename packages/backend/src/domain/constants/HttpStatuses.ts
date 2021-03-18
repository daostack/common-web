import { GenericError, NotImplementedError } from './ErrorCodes';

export const GenericErrorStatus = 500;

export const HttpStatuses = {
  [GenericError]: GenericErrorStatus,
  [NotImplementedError]: GenericErrorStatus
};