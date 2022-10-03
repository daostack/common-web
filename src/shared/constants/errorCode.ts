export enum ErrorCode {
  // Front-end error codes
  CUserDoesNotExist = "CUserDoesNotExist",

  // Back-end error codes
  // PayMeError
  SellerRejected = "External.PayMeError.SellerRejected",
  InvalidBankDetails = "External.PayMeError.InvalidBankDetails",
  CannotUploadDocs = "External.PayMeError.CannotUploadDocs",

  // Leave Common
  LastMember = "LAST_MEMBER",
  LastInCriticalCircle = "LAST_IN_CRITICAL_CIRCLE",
  UserHasOpenProposals = "USER_HAS_OPEN_PROPOSALS",
}
