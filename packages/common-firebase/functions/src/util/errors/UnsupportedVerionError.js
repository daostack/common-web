const CommonError = require('./CommonError');

const UnsupportedVersionErrorCode = 1;

class UnsupportedVersionError extends CommonError {
  constructor(errorMsg) {
    super('UnsupportedVersionError: ' + errorMsg);

    this.name = this.constructor.name;
    this.errorCode = UnsupportedVersionErrorCode;
  }
}

module.exports = {
  UnsupportedVersionError,
  UnsupportedVersionErrorCode
}