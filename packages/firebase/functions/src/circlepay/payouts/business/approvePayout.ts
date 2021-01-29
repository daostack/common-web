import * as yup from 'yup';
import { validate } from '../../../util/validate';
import { payoutDb } from '../database';
import { CommonError } from '../../../util/errors';
import { updatePayout } from '../database/updatePayout';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';

const approvePayoutSchema = yup.object({
  payoutId: yup
    .string()
    .uuid()
    .required(),

  index: yup
    .number()
    .required(),

  token: yup
    .string()
    .required()
});

type ApprovePayoutPayload = yup.InferType<typeof approvePayoutSchema>;

export const approvePayout = async (payload: ApprovePayoutPayload): Promise<boolean> => {
  // Validate the payload
  await validate(payload, approvePayoutSchema);

  // Get the payout
  const payout = await payoutDb.get(payload.payoutId);

  // Check if the payout is voided
  if (payout.voided) {
    throw new CommonError('Cannot approve voided payout!', {
      payoutId: payload.payoutId
    });
  }

  // If the payout is executed just return true
  if (payout.executed) {
    return true;
  }

  // Find the token
  const token = payout.security.find(x => x.id === Number(payload.index));

  if (!token) {
    throw new CommonError(`There is no token with ID ${payload.index}`);
  }

  if (token.redeemed) {
    return true;
  }

  // Check the token
  if (token.token === payload.token) {
    // If the token is valid - redeem it
    token.redeemed = true;

    // Create event
    await createEvent({
      objectId: payout.id,
      type: EVENT_TYPES.PAYOUT_APPROVED
    });
  } else {
    // If the token is invalid - change the redemption attempts number
    token.redemptionAttempts += 1;

    // If the redemption attempts are more than or equal to 3 void the payout
    if (token.redemptionAttempts >= 3) {
      payout.voided = true;

      // Create event
      await createEvent({
        objectId: payout.id,
        type: EVENT_TYPES.PAYOUT_VOIDED
      });
    }
  }

  // Update the token in the payout
  const tokenIndex = payout.security.findIndex(x => x.id === token.id);

  payout.security[tokenIndex] = token;

  // Save the changes
  await updatePayout(payout);


  // Return the current status of the payout
  return token.redeemed;
};