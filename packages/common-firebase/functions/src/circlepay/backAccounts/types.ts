import { IBaseEntity } from '../../util/types';

export interface IBankAccountEntity extends IBaseEntity {
  /**
   * The ID of the bank account on circle side. This ID should be used
   * when initiating payout
   */
  circleId: string;

  /**
   * A UUID that uniquely identifies the bank account. If the same bank
   * account is used more than once, each account object will have a
   * different id, but the fingerprint will stay the same.
   */
  circleFingerprint: string;

  bank: IBankAccountBank;
  billingDetails: IBankAccountBillingDetails;
}

export interface IBankAccountBillingDetails {
  /**
   * Full name of the card or bank account holder.
   */
  name: string;

  /**
   * City portion of the address.
   */
  city: string;

  /**
   * State / County / Province / Region portion of the address. If the country
   * is US or Canada district is required and should use the two-letter
   * code for the subdivision.
   */
  district?: string;

  /**
   * Postal / ZIP code of the address.
   */
  postalCode: string;

  /**
   * Country portion of the address. Formatted as a two-letter
   * country code specified in ISO 3166-1 alpha-2.
   */
  country: string;

  /**
   * Line one of the street address.
   */
  line1: string;

  /**
   * Line two of the street address.
   */
  line2?: string;
}

export interface IBankAccountBank {
  /**
   * Name of the bank. This property is required for bank
   * accounts outside of the US that do not support IBAN
   */
  bankName: string;

  /**
   * City portion of the address.
   */
  city: string;

  /**
   * State / County / Province / Region portion of the address. If the country
   * is US or Canada district is required and should use the two-letter
   * code for the subdivision.
   */
  district?: string;

  /**
   * Postal / ZIP code of the address.
   */
  postalCode: string;

  /**
   * Country portion of the address. Formatted as a two-letter
   * country code specified in ISO 3166-1 alpha-2.
   */
  country: string;

  /**
   * Line one of the street address.
   */
  line1: string;

  /**
   * Line two of the street address.
   */
  line2?: string;
}