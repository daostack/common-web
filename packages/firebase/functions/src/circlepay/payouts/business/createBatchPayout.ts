import * as yup from 'yup';
import crypto from 'crypto';

import { IPayoutEntity } from '../types';
import { validate } from '../../../util/validate';
import { proposalDb } from '../../../proposals/database';
import { payoutDb } from '../database';
import { CommonError, NotFoundError } from '../../../util/errors';
import { env } from '../../../constants';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';
import { bankAccountDb } from '../../backAccounts/database';
import { IFundingRequestProposal } from '@common/types';

const validationSchema = yup.object({
  wireId: yup
    .string()
    .required()
    .uuid(),

  proposalIds: yup
    .array()
    .of(yup.string())
    .max(10)
});

type ICreateBatchPayoutPayload = yup.InferType<typeof validationSchema>;

export const createBatchPayout = async (payload: ICreateBatchPayoutPayload): Promise<IPayoutEntity> => {
  await validate<ICreateBatchPayoutPayload>(payload, validationSchema as any);

  const wire = await bankAccountDb.get(payload.wireId);

  const proposals = await proposalDb.getMany({
    ids: payload.proposalIds as any
  });

  if (proposals.length !== payload.proposalIds?.length) {
    throw new NotFoundError('Cannot create batch payout, because one or more proposals cannot be found');
  }

  for (const proposal of proposals) {
    if (proposal.type !== 'fundingRequest') {
      throw new CommonError('Cannot create batch payout, because one of the proposals is not funding proposal');
    }

    // eslint-disable-next-line no-await-in-loop
    const payouts = await payoutDb.getMany({
      proposalIds: proposal.id,
      status: [
        'complete',
        'pending'
      ]
    });

    if (payouts.length) {
      throw new CommonError('Cannot create batch payout, because one of the proposals has pending or completed payout', {
        proposalId: proposal.id,
        payouts
      });
    }
  }

  // Create the payout
  const payout = await payoutDb.add({
    circlePayoutId: null,
    type: 'proposal',
    proposalIds: payload.proposalIds as unknown as string[],

    amount: (proposals as IFundingRequestProposal[]).reduce<number>((a, b) => a + b.fundingRequest.amount, 0),

    destination: {
      circleId: wire.circleId,
      id: wire.id
    },

    security: env.payouts.approvers.map((approver, index) => ({
      id: index,
      token: crypto.randomBytes(32).toString('hex'),
      redeemed: false,
      redemptionAttempts: 0
    })),

    status: 'pending',
    executed: false,
    voided: false
  });

  // Create the event
  await createEvent({
    objectId: payout.id,
    type: EVENT_TYPES.PAYOUT_CREATED
  });

  // Return the created proposal
  return payout;
};