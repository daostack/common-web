import { CommonError } from './CommonError';

// @todo Move that tho constants file with all other error codes
export const UnsupportedVersionErrorCode = "UnsupportedVersion";

export class UnsupportedVersionError extends CommonError {
  constructor(errorMsg: string) {
    super('UnsupportedVersionError: ' + errorMsg);

    this.name = this.constructor.name;
    this.errorCode = UnsupportedVersionErrorCode;
  }
}
