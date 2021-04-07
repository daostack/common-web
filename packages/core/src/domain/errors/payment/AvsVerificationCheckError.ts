import { CommonError } from '@errors';
import { HttpStatuses, ErrorCodes } from '@constants';

export class AvsVerificationCheckError extends CommonError {
  constructor(cardId?: string) {
    super(`Avs verification failed for card with ID ${cardId || 'unknown'}`, {
      cardId,

      statusCode: HttpStatuses.UnprocessableEntity,
      errorCode: ErrorCodes.AvsVerificationError
    });
  }
}