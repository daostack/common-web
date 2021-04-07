import { CommonError } from '../index';
import { ErrorCodes, HttpStatuses } from '../../constants/index';

export class NotFoundError extends CommonError {
  constructor(entity: string, identifier?: string, ...rest: any[]) {
    super(`Not Found Error: ${entity} was not found`, {
      name: 'NotFoundError',

      searchPayload: {
        entity,
        identifier,
        ...rest
      },

      errorCode: ErrorCodes.NotFoundError,
      statusCode: HttpStatuses[ErrorCodes.NotFoundError]
    });
  }
}