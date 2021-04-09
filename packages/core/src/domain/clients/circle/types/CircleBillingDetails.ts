export interface ICircleBillingDetails {
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
  line2?: string | null;

  /**
   * State / County / Province / Region portion of the address. It is optional
   * except if the country is US or Canada district is required and
   * should use the two-letter code for the subdivision.
   */
  district?: string | null;

  /**
   * Postal / ZIP code of the address.
   */
  postalCode: string;
}