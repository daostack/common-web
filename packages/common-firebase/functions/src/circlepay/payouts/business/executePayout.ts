import { IPayoutEntity } from '../types';
import { CommonError } from '../../../util/errors';
import { externalRequestExecutor } from '../../../util';
import axios from 'axios';
import { circlePayApi } from '../../../settings';
import { ErrorCodes } from '../../../constants';
import { getCircleHeaders } from '../../index';
import { ICircleCreatePayoutPayload, ICircleCreatePayoutResponse } from '../../types';
import { env } from '../../../constants';
import { payoutDb } from '../database';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';


/**
 * Sends the payout to circle for execution
 *
 * @param payout - The payout to be executed
 */
export const executePayout = async (payout: IPayoutEntity): Promise<void> => {
  if (payout.executed) {
    throw new CommonError('Cannot reexecute payout!', {
      payout
    });
  }

  // Format the data
  const headers = await getCircleHeaders();
  const data: ICircleCreatePayoutPayload = {
    idempotencyKey: payout.id,
    amount: {
      amount: payout.amount / 100,
      currency: 'USD'
    },
    destination: {
      id: payout.destination.circleId,
      type: 'wire'
    },
    metadata: {
      beneficiaryEmail: env.payouts.approvers[0] // @todo If it is payout based proposal use the email of the proposer
    }
  };

  // Make the request to circle
  const { data: response } = await externalRequestExecutor<ICircleCreatePayoutResponse>(async () => {
    return (await axios.post<ICircleCreatePayoutResponse>(`${circlePayApi}/payouts`,
      data,
      headers
    )).data;
  }, {
    errorCode: ErrorCodes.CirclePayError,
    userMessage: 'Cannot create the bank account, because it was rejected by Circle'
  });


  // Update the entities
  const updatedPayout = await payoutDb.update({
    ...payout,

    circlePayoutId: response.id,
    status: response.status,
    executed: true
  });

  // Broadcast the events
  await createEvent({
    objectId: updatedPayout.id,
    type: EVENT_TYPES.PAYOUT_EXECUTED
  });
};