import { CommonError } from './CommonError';
import { ErrorCodes, StatusCodes } from '../../constants';

/**
 * The exception that is thrown when something is wrong with the card like
 * failed CVV or AVS checks, invalid expiry date and so on
 */
export class CvvVerificationError extends CommonError {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(cardId?: string) {
    super(`CVV verification failed for card with ID ${cardId || 'unknown'}`, {
      cardId,

      statusCode: StatusCodes.InternalServerError,
      errorCode: ErrorCodes.CvvVerificationFail
    });
  }
}