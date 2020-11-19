import { CommonError } from './CommonError';

export const UnsupportedVersionErrorCode = "UnsupportedVersion";

export class UnsupportedVersionError extends CommonError {
  constructor(errorMsg: string) {
    super('UnsupportedVersionError: ' + errorMsg);

    this.name = this.constructor.name;
    this.errorCode = UnsupportedVersionErrorCode;
  }
}
