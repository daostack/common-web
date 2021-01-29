import { IEventTrigger } from '../../../util/types';
import { EVENT_TYPES } from '../../../event/event';
import { CommonError } from '../../../util/errors';
import { env } from '../../../constants';
import emailClient from './../../../notification/email';
import { payoutDb } from '../database';
import { bankAccountDb } from '../../backAccounts/database';
import { proposalDb } from '../../../proposals/database';
import { IProposalPayoutEntity } from '../types';
import { commonDb } from '../../../common/database';

export const onPayoutCreated: IEventTrigger = async (eventObj) => {
  if(eventObj.type !== EVENT_TYPES.PAYOUT_CREATED) {
    throw new CommonError(`onPayoutCreated was executed on ${eventObj.type}`);
  }

  const payout = await payoutDb.get(eventObj.objectId);
  const wire = await bankAccountDb.get(payout.destination.id);

  const proposal = payout.type === 'proposal'
    ? await proposalDb.getProposal((payout as IProposalPayoutEntity).proposalId)
    : null;

  const common = proposal
    ? await commonDb.get(proposal.commonId)
    : null;

  env.payouts.approvers.map((async (approver, index) => {
    const urlBase = process.env.NODE_ENV === 'dev'
      ? env.local
      : env.endpoints.base;

    await emailClient.sendTemplatedEmail({
      templateKey: 'approvePayout',
      to: approver,
      subjectStubs: null,
      emailStubs: {
        beneficiary: `${wire.billingDetails.name}`,
        proposal: proposal
          ? `${(proposal.description as any).title} (${proposal.id})`
          : 'Independent Payout',

        common: common
          ? `${common.name} (${common.id})`
          : 'Independent Payout',

        bankDescription: wire.description || 'The bank account has no description',
        bank: wire.bank.bankName,

        payoutId: payout.id,
        amount: (payout.amount / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        url: `${urlBase}/circlepay/payouts/approve?payoutId=${payout.id}&index=${index}&token=${payout.security[index].token}`
      }
    });
  }));
}