import { CommonError } from '../index';
import { HttpStatuses, ErrorCodes } from '../../constants/index';

export class CvvVerificationCheckError extends CommonError {
  constructor(cardId?: string) {
    super(`CVV verification failed for card with ID ${cardId || 'unknown'}`, {
      cardId,

      statusCode: HttpStatuses.UnprocessableEntity,
      errorCode: ErrorCodes.CvvVerificationError
    });
  }
}