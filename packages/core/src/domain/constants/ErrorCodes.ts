const BaseErrorCode = 'Common.Error';

export const GenericError = `${BaseErrorCode}.Generic`;
export const NotImplementedError = `${BaseErrorCode}.NotImplemented`;


export const NotFoundError = `${BaseErrorCode}.Http.NotFound`;

export const CvvVerificationError = `${BaseErrorCode}.Payments.Verification.CVV`;
export const AvsVerificationError = `${BaseErrorCode}.Payments.Verification.AVS`;

export const ErrorCodes = {
  GenericError,
  NotImplementedError,

  NotFoundError,

  CvvVerificationError,
  AvsVerificationError
};