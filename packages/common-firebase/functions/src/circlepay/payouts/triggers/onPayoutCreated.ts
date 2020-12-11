import { IEventTrigger } from '../../../util/types';
import { EVENT_TYPES } from '../../../event/event';
import { CommonError } from '../../../util/errors';
import { env } from '../../../constants';
import emailClient from './../../../notification/email';
import { payoutDb } from '../database';

export const onPayoutCreated: IEventTrigger = async (eventObj) => {
  if(eventObj.type !== EVENT_TYPES.PAYOUT_CREATED) {
    throw new CommonError(`onPayoutCreated was executed on ${eventObj.type}`);
  }

  const payout = await payoutDb.get(eventObj.objectId);

  env.payouts.approvers.map((async (approver, index) => {
    const urlBase = process.env.NODE_ENV === 'dev'
      ? env.local
      : env.endpoints.base;

    await emailClient.sendTemplatedEmail({
      templateKey: 'approvePayout',
      to: approver,
      subjectStubs: null,
      emailStubs: {
        payoutId: payout.id,
        amount: (payout.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        url: `${urlBase}/circlepay/payouts/approve?payoutId=${payout.id}&index=${index}&token=${payout.security[index].token}`
      }
    });
  }));
}