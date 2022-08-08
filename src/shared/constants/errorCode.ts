export enum ErrorCode {
  // Front-end error codes
  CUserDoesNotExist = "CUserDoesNotExist",

  // Back-end error codes
  SellerRejected = "External.PayMeError.SellerRejected",
  InvalidBankDetails = "External.PayMeError.InvalidBankDetails",
  CannotUploadDocs = "External.PayMeError.CannotUploadDocs",
}
