import * as yup from 'yup';
import crypto from 'crypto';


import { IPayoutEntity } from '../types';
import { validate } from '../../../util/validate';
import { bankAccountDb } from '../../backAccounts/database';
import { payoutDb } from '../database';
import { env } from '../../../constants';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';

const createPayoutValidationSchema = yup.object({
  amount: yup
    .number()
    .required(),

  bankAccountId: yup
    .string()
    .uuid()
    .required()
});

type CreatePayoutPayload = yup.InferType<typeof createPayoutValidationSchema>;

export const createIndependentPayout = async (payload: CreatePayoutPayload): Promise<IPayoutEntity> => {
  // Validate the payload
  await validate(payload, createPayoutValidationSchema);

  // Get needed data (and check if the proposal and bank account exists)
  const bankAccount = await bankAccountDb.get(payload.bankAccountId);

  // Create the payout
  const payout = await payoutDb.add({
    type: 'independent',

    amount: payload.amount,

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