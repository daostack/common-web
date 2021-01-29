import axios from 'axios';

import { IPayoutEntity } from '../types';
import { externalRequestExecutor } from '../../../util';
import { ICircleGetPayoutResponse } from '../../types';
import { circlePayApi } from '../../../settings';
import { ErrorCodes } from '../../../constants';
import { getCircleHeaders } from '../../index';
import { payoutDb } from '../database';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';

export const updatePayoutStatus = async (payout: IPayoutEntity): Promise<void> => {
  if (!payout.executed) {
    logger.error('Only executed proposal have statuses', { payout });

    return;
  }

  if (payout.status !== 'pending') {
    logger.warn('The payout is in it\'s final state', { payout });

    return;
  }

  // Get the headers, needed for request, ang get the status from circle
  const headers = await getCircleHeaders();

  const { data: response } = await externalRequestExecutor<ICircleGetPayoutResponse>(async () => {
    return (await axios.get<ICircleGetPayoutResponse>(`${circlePayApi}/payout/${payout.circlePayoutId}`,
      headers
    )).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Cannot create the bank account, because it was rejected by Circle'
  });

  // If the status have changed broadcast the event
  if (response.status !== 'pending') {
    await createEvent({
      objectId: payout.id,
      type: response.status === 'complete'
        ? EVENT_TYPES.PAYOUT_COMPLETED
        : EVENT_TYPES.PAYOUT_FAILED
    });
  }

  await payoutDb.update({
    ...payout,
    status: response.status
  });
};