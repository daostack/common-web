// ---- Helper types

export type CircleCardNetwork = 'VISA' | 'MASTERCARD';
export type CircleCvvCheck = 'pending' | 'pass' | 'fail' | 'unavailable' | 'not_requested';

// ---- Helper interfaces

export interface ICircleCardBillingDetails {
  name: string;
  city: string;
  line1: string;
  line2?: string;
  country: string;
  district: string;
  postalCode: string;
}

export interface ICircleCardMetadata {
  email: string;
  phoneNumber?: string;
}

export interface ICircleCardVerification {
  avs: 'pending' | string;
  cvv: CircleCvvCheck;
}

export interface ICircleCardRiskEvaluation {
  [key: string]: any;
}

export interface ICircleCard {
  id: string;

  riskEvaluation?: ICircleCardRiskEvaluation;
  billingDetails: ICircleCardBillingDetails;
  verification: ICircleCardVerification;
  metadata: ICircleCardMetadata;

  network: CircleCardNetwork;

  fingerprint: string;
  errorCode?: string;

  createDate: Date;
  updateDate: Date;

  expMonth: number;
  expYear: number;
  last4: string;
}