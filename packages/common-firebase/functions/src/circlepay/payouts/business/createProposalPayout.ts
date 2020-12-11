import * as yup from 'yup';
import crypto from 'crypto';

import { IPayoutEntity } from '../types';
import { validate } from '../../../util/validate';
import { bankAccountDb } from '../../backAccounts/database';
import { payoutDb } from '../database';
import { proposalDb } from '../../../proposals/database';
import { env } from '../../../constants';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';

const createProposalPayoutValidationSchema = yup.object({
  proposalId: yup
    .string()
    .uuid()
    .required(),

  bankAccountId: yup
    .string()
    .uuid()
    .required()
});

type CreateProposalPayoutPayload = yup.InferType<typeof createProposalPayoutValidationSchema>;

export const createProposalPayout = async (payload: CreateProposalPayoutPayload): Promise<IPayoutEntity> => {
  // Validate the payload
  await validate(payload, createProposalPayoutValidationSchema);

  // Get needed data (and check if the proposal and bank account exists)
  const proposal = await proposalDb.getFundingRequest(payload.proposalId);
  const bankAccount = await bankAccountDb.get(payload.bankAccountId);

  // @todo Check if there is no (or all are expired) payouts for that proposal
  // @todo Check if the proposal is funded

  // Create the payout
  const payout = await payoutDb.add({
    circlePayoutId: null,
    type: 'proposal',
    proposalId: payload.proposalId,

    amount: proposal.fundingRequest.amount,

    destination: {
      circleId: bankAccount.circleId,
      id: bankAccount.id
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