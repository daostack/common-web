import { CommonError } from './CommonError';
import { ErrorCodes, StatusCodes } from '../../constants';


export class NotFoundError extends CommonError {
  /**
   * Creates new NotFound error that should set the correct
   * response on entity not found
   *
   * @param identifier - The parameter witch was used for the failed search
   * @param entity - The type of entity, that was not found
   */
  constructor(identifier: string, entity?: string) {
    super(`Cannot find ${entity || 'entity'} with identifier ${identifier}`, {
      userMessage:
        (entity)
          ? `Ooops! We were not able to find ${entity} with id ${identifier}`
          : 'We were unable to find the requested resource!',
      errorCode: ErrorCodes.NotFound,
      statusCode: StatusCodes.NotFound
    });
  }
}