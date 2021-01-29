import { IEventTrigger } from '../../../util/types';
import { EVENT_TYPES } from '../../../event/event';
import { CommonError } from '../../../util/errors';
import { env } from '../../../constants';
import { payoutDb } from '../database';
import { executePayout } from '../business/executePayout';

export const onPayoutApproved: IEventTrigger = async (eventObj) => {
  if(eventObj.type !== EVENT_TYPES.PAYOUT_APPROVED) {
    throw new CommonError(`onPayoutApproved was executed on ${eventObj.type}`);
  }

  const payout = await payoutDb.get(eventObj.objectId);

  // Check if there are enough approvals for execution (and execute it if there are)
  if(payout.security.filter(x => x.redeemed).length >= env.payouts.neededApprovals) {
    await executePayout(payout);
  }
}