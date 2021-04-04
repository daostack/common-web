import { CommonError } from '@errors';
import { HttpStatuses, ErrorCodes } from '@constants';

export class CvvVerificationCheckError extends CommonError {
  constructor(cardId?: string) {
    super(`CVV verification failed for card with ID ${cardId || 'unknown'}`, {
      cardId,

      statusCode: HttpStatuses.UnprocessableEntity,
      errorCode: ErrorCodes.CvvVerificationError
    });
  }
}