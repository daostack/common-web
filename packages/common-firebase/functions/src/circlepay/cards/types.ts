import { IBaseEntity } from '../../util/types';

export interface ICardEntity extends IBaseEntity {
  /**
   * This is the ID of the card for circle. When creating
   * charge request we should pass this ID to them
   */
  circleCardId: string;

  /**
   * This is the ID of the user, who created the card
   */
  ownerId: string;

  /**
   * Some metadata, useful for the UI
   */
  metadata: ICardMetadata;
}

/**
 * Unrelated to the payment data, that may be useful for
 * the UI or fraud prevention
 */
export interface ICardMetadata {
  billingDetails: ICardBillingDetails;

  /**
   * The network of the card.
   */
  network: 'VISA' | 'MASTERCARD';

  /**
   * The last 4 digits of the card. Useful for
   * card identification by the user
   */
  digits: string;
}

/**
 *
 */
export interface ICardBillingDetails {
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
  line2?: string;

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