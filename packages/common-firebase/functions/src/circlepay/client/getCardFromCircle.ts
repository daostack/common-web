import axios from 'axios';

import { externalRequestExecutor } from '../../util';
import { circlePayApi } from '../../settings';
import { ErrorCodes } from '../../constants';

import { getCircleHeaders } from '../index';

// ---- Helper types

export type CircleCardNetwork = 'VISA' | 'MASTERCARD';
export type CircleCvvCheck = 'pending' | 'pass' | 'fail' | 'unavailable' | 'not_requested';

// ---- Helper interfaces

export interface ICircleCardBillingDetails {
  name: string;
  city: string;
  line1: string;
  line2: string;
  country: string;
  district: string;
  postalCode: string;
}

export interface ICircleCardMetadata {
  email: string;
  phoneNumber: string;
}

export interface ICircleCardVerification {
  avs: 'pending' | string;
  cvv: CircleCvvCheck;
}

export interface ICircleCardRiskEvaluation {
  // @todo Add the types for the risk evaluation
  [key: string]: any;
}

// ---- General interface

export interface ICircleCard {
  id: string;

  riskEvaluation: ICircleCardRiskEvaluation;
  billingDetails: ICircleCardBillingDetails;
  verification: ICircleCardVerification;
  metadata: ICircleCardMetadata;

  network: CircleCardNetwork;

  createDate: Date;
  updateDate: Date;

  expMonth: number;
  expYear: number;
  last4: string;
}

export interface IGetCircleCardResponse {
  data: ICircleCard;
}

/**
 * Get the current version of a card on circle side
 *
 * @param circleCardId - The ID of the card as is in circle (the ID they gave us
 *                       on card creation)
 */
export const getCardFromCircle = async (circleCardId: string): Promise<IGetCircleCardResponse> => {
  const headers = await getCircleHeaders();

  return externalRequestExecutor<IGetCircleCardResponse>(async () => {
    return (await axios.get<IGetCircleCardResponse>(`${circlePayApi}/cards/${circleCardId}`, headers)).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    message: 'Failed getting card details from circle'
  });
};