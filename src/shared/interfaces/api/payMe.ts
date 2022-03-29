export interface BuyerTokenPageCreationData {
  cardId: string;
}

export enum PaymeTypeCodes {
  SocialId, //Social ID document. For additional information see Note 3 above
  BankAccountOwnership, //Proof of bank account ownership or a cancelled cheque photo. For additional information see Note 3 above
  CorporateCertificate, //For additional information see Note 3 above
  BankAuthorization, //Bank authorization
  PersonalGuarantee, //Relevant only if was requested by your Account Manager
  PromissoryNote, //Relevant only if was requested by your Account Manager
  ProcessingAgreement, //Relevant only if was requested by your Account Manager
  Signature, //Relevant only if was requested by your Account Manager
  Stamp, //Relevant only if was requested by your Account Manager
  SignatoriesApproval, //Relevant only if was requested by your Account Manager
  AdditionalLicense, //Relevant only if was requested by your Account Manager
  PublicRepresentative, //Relevant only if was requested by your Account Manager
  RegulatoryAuthentication, //Regulatory authentication. Relevant only if was requested by your Account Manager
  AuthorizedSignerProtocol, //Relevant only if was requested by your Account Manager
  BusinessProof, //Relevant only if was requested by your Account Manager
  ServiceReceiver, //Relevant only if was requested by your Account Manager
  FaceToFaceApproval, //Relevant only if was requested by your Account Manager
  FalseStatementOfInformation, //Relevant only if was requested by your Account Manager
  CompanyLogo, //Relevant only if was requested by your Account Manager
  DrivingLicense, //Relevant if you are onboarding sellers for Keep services
  SocialIDAppendix, //Relevant if you are onboarding sellers for Keep services
  Passport, //Relevant if you are onboarding sellers for Keep services
  OriginTaxConfirmation, //Relevant if you are onboarding sellers for Keep services
  BookkeepingCertificate, //Relevant if you are onboarding sellers for Keep services
  Invoice , // Not related to PayMe
}

export interface PaymeDocument {
  name: string;
  legalType: PaymeTypeCodes;
  amount: number;
  mimeType: string;
  downloadURL: string;
}
