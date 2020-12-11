// ---- Card related ---- //

import { CirclePaymentStatus } from '../util/types';

// ---- Shared

interface ICircleIndempotentPayload {
  idempotencyKey: string;
}

// ---- Unsorted

export interface ICircleCreateCardResponse {
  data: {
    id: string;

    billingDetails: ICircleBillingDetails;

    metadata: {
      email: string;
      phoneNumber: string;
    }

    expMonth: number;
    expYear: number;
    network: 'VISA' | 'MASTERCARD';
    last4: string;
    createDate: Date;
    updateDate: Date;
  }
}

export interface ICircleCreateCardPayload {
  /**
   * Unique idempotency key. This key is utilized to ensure
   * exactly-once execution of mutating requests.
   */
  idempotencyKey: string;

  /**
   * Unique identifier of the public key used in encryption.
   */
  keyId: string;

  /**
   * PGP encrypted json string. The object format given here needs to
   * be stringified and PGP encrypted before it is sent to the server,
   * so encryptedData will end up as a string, rather than an object.
   */
  encryptedData: string;

  billingDetails: ICircleBillingDetails

  /**
   * Two digit number representing the card's expiration month.
   */
  expMonth: number;

  /**
   * Four digit number representing the card's expiration year.
   */
  expYear: number;


  metadata: ICircleMetadata;
}

interface ICircleBillingDetails {
  /**
   * Full name of the card or bank account holder.
   */
  name: string;

  /**
   * City portion of the address.
   */
  city: string;

  /**
   * Country portion of the address. Formatted as a
   * two-letter country code specified in ISO 3166-1 alpha-2.
   */
  country: string;

  /**
   * Line one of the street address.
   */
  line1: string;

  /**
   * Line two of the street address. Optional
   */
  line2: string;

  /**
   * State / County / Province / Region portion of the address. It is optional
   * except if the country is US or Canada district is required and
   * should use the two-letter code for the subdivision.
   */
  district?: string;

  /**
   * Postal / ZIP code of the address.
   */
  postalCode: string;
}

interface IAmount {
  amount: number;
  currency: string;
}

// ---- Payment Related ---- //

type PaymentVerification = 'none' | 'cvv';

type IPaymentAmount = IAmount;

interface IPaymentSource {
  id: string;
  type: 'card';
}

interface IPaymentFee {
  amount: string;
  currency: string;
}

interface ICircleCreatePaymentBase {
  verification: PaymentVerification;
  metadata: ICircleMetadata;
  amount: IPaymentAmount;
  source: IPaymentSource;


  idempotencyKey: string;
}

interface ICircleCreatePaymentVerification extends ICircleCreatePaymentBase {
  verification: 'cvv';

  keyId: string;
  encryptedData: string;
}

interface ICircleCreatePaymentNoVerification extends ICircleCreatePaymentBase {
  verification: 'none';
}

export type ICircleCreatePaymentPayload = ICircleCreatePaymentVerification | ICircleCreatePaymentNoVerification;

export type ICircleCreatePaymentResponse = ICirclePayment;

export interface ICirclePayment {
  data: {
    id: string;
    type: 'payment';
    status: CirclePaymentStatus;
    fees: IPaymentFee;

    [key: string]: any;
  }
}

// ---- Shared ---- //
interface ICircleMetadata {
  /**
   * Email of the user
   */
  email: string;

  /**
   * Hash of the session identifier; typically of the end user.
   */
  sessionId: string;

  /**
   * Single IPv4 or IPv6 address of user
   */
  ipAddress: string;
}

// ----- Payout types

type IPayoutAmount = IAmount;
type IPayoutStatus = 'pending' | 'failed' | 'complete';


interface ICirclePayoutDestination {
  type: 'wire';

  /**
   * The ID on circle side of the destination
   */
  id: string;
}

interface ICirclePayoutMetadata {
  beneficiaryEmail: string;
}

export interface ICircleCreatePayoutPayload extends ICircleIndempotentPayload {
  destination: ICirclePayoutDestination;
  metadata: ICirclePayoutMetadata;
  amount: IPayoutAmount;
}

export interface ICircleCreatePayoutResponse {
  data: {
    id: string;
    status: IPayoutStatus;
    destination: ICirclePayoutDestination;
  }
}

export interface ICircleGetPayoutResponse {
  data: {
    id: string;
    destination: ICirclePayoutDestination;
    amount: IPayoutAmount;
    status: IPayoutStatus;
  }
}