import { ICircleBillingDetails } from '@circle/types/CircleBillingDetails';
import { $circleClient } from '@circle/client';

export interface ICircleCreateBankAccountPayload {
  idempotencyKey: string;

  iban?: string;
  routingNumber?: string;
  accountNumber?: string;

  billingDetails: ICircleBillingDetails;

  bankAddress: Omit<ICircleBillingDetails, 'name' | 'line1'> & {
    bankName: string;
    line1?: string | null;
    line2?: string | null;
  }
}

export interface ICircleCreateBankAccountResponse {
  data: {
    id: string;
    description: string;
    trackingRef: string;
    fingerprint: string;

    billingDetails: ICircleBillingDetails;
    bankAddress: ICircleBillingDetails & {
      name: undefined;

      bankName: string;
      line1?: string;
    }
  }
}

export const _createWire = async (request: ICircleCreateBankAccountPayload): Promise<ICircleCreateBankAccountResponse> => {
  return (await $circleClient.post<ICircleCreateBankAccountResponse>('/banks/wires', request)).data;
};