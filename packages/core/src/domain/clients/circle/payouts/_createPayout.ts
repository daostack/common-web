import { $circleClient } from '@circle/client';

type CircleCurrency = 'USD';

interface ICircleIdempotentPayload {
  idempotencyKey: string;
}

interface IAmount {
  amount: number;
  currency: CircleCurrency;
}

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

export interface ICircleCreatePayoutPayload extends ICircleIdempotentPayload {
  destination: ICirclePayoutDestination;
  metadata: ICirclePayoutMetadata;
  amount: IPayoutAmount;
}

export interface ICirclePayout {
  id: string;
  status: IPayoutStatus;
  destination: ICirclePayoutDestination;
}

export interface ICircleCreatePayoutResponse {
  data: ICirclePayout
}


export const _createCirclePayout = async (request: ICircleCreatePayoutPayload): Promise<ICircleCreatePayoutResponse> => {
  const response = await $circleClient.post<ICircleCreatePayoutResponse>(`/payouts`, request);

  return response.data;
};

