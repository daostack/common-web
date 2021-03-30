import {
  ICircleMetadata,
  ICirclePaymentAmount,
  IPaymentSource,
  PaymentVerification,
  ICirclePayment
} from '@circle/types';
import { $circleClient } from '@circle/client';
import { CommonError } from '@errors';

export interface ICircleCreatePaymentPayload {
  verification: PaymentVerification;
  metadata: ICircleMetadata;
  amount: ICirclePaymentAmount;
  source: IPaymentSource;

  description: string;
  idempotencyKey: string;
}

export interface ICircleCreatePaymentResponse {
  data: ICirclePayment;
}

export const _createCirclePayment = async (request: ICircleCreatePaymentPayload): Promise<ICircleCreatePaymentResponse> => {
  if (request.amount.amount > 2500) {
    throw new CommonError('Cannot make payments larger than $2500. Please make sure that the correct amount has been passed', {
      request
    });
  }

  const response = await $circleClient.post<ICircleCreatePaymentResponse>(`/payments`, request);

  return response.data;
};
