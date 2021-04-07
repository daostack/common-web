import { ICircleCard, ICircleMetadata, ICircleBillingDetails } from '@circle/types';
import { $circleClient } from '@circle/client';

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

  /**
   * The billing details of the user as are for this exact card
   */
  billingDetails: ICircleBillingDetails

  /**
   * Two digit number representing the card's expiration month.
   */
  expMonth: number;

  /**
   * Four digit number representing the card's expiration year.
   */
  expYear: number;


  /**
   * Metadata for the request, required by Circle
   */
  metadata: ICircleMetadata;
}

export interface ICircleCreateCardResponse {
  data: ICircleCard;
}

export const _createCircleCard = async (request: ICircleCreateCardPayload): Promise<ICircleCreateCardResponse> => {
  const response = await $circleClient.post<ICircleCreateCardResponse>('/cards', request);

  return response.data;
};