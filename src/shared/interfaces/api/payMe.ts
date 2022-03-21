export interface BuyerTokenPageCreationData {
  cardId: string;
}

export enum PAYME_TYPE_CODES {
  "Social Id" = 1, //Social ID document. For additional information see Note 3 above
  "Bank Account Ownership" = 2, //Proof of bank account ownership or a cancelled cheque photo. For additional information see Note 3 above
  "Corporate Certificate" = 3, //For additional information see Note 3 above
  "Bank Authorization" = 4, //Bank authorization
  "Personal Guarantee" = 5, //Relevant only if was requested by your Account Manager
  "Promissory Note" = 6, //Relevant only if was requested by your Account Manager
  "Processing Agreement" = 7, //Relevant only if was requested by your Account Manager
  "Signature" = 8, //Relevant only if was requested by your Account Manager
  "Stamp" = 9, //Relevant only if was requested by your Account Manager
  "Signatories Approval" = 10, //Relevant only if was requested by your Account Manager
  "Additional License" = 11, //Relevant only if was requested by your Account Manager
  "Public Representative" = 12, //Relevant only if was requested by your Account Manager
  "Regulatory Authentication" = 13, //Regulatory authentication. Relevant only if was requested by your Account Manager
  "Authorized Signer Protocol" = 14, //Relevant only if was requested by your Account Manager
  "Business Proof" = 15, //Relevant only if was requested by your Account Manager
  "Service Receiver" = 16, //Relevant only if was requested by your Account Manager
  "Face-To-Face Approval" = 17, //Relevant only if was requested by your Account Manager
  "False Statement Of Information" = 18, //Relevant only if was requested by your Account Manager
  "Company Logo" = 23, //Relevant only if was requested by your Account Manager
  "Driving License" = 24, //Relevant if you are onboarding sellers for Keep services
  "Social ID Appendix" = 25, //Relevant if you are onboarding sellers for Keep services
  "Passport" = 26, //Relevant if you are onboarding sellers for Keep services
  "Origin Tax Confirmation" = 27, //Relevant if you are onboarding sellers for Keep services
  "Bookkeeping Certificate" = 28, //Relevant if you are onboarding sellers for Keep services
  "Invoice" = 29, // Not related to PayMe
}

export interface BankAccountDetails {
  bankName: string;
  bankCode: number;
  branchNumber: number;
  accountNumber: number;
  identificationDocs: PaymeDocument[];
  city: string;
  country: string;
  streetAddress: string;
  streetNumber: number;
  socialId: string;
  socialIdIssueDate: string;
  birthdate: string;
  gender: number;
  phoneNumber: string;
}

export interface PaymeDocument {
  name: string;
  legalType: PAYME_TYPE_CODES;
  amount: number;
  mimeType: string;
  downloadURL: string;
}
