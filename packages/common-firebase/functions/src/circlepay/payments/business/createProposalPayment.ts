import * as yup from 'yup';

import { IProposalPayment } from '../types';
import { CommonError, PaymentError } from '../../../util/errors';
import { validate } from '../../../util/validate';
import { proposalDb } from '../../../proposals/database';

import { createPayment } from './createPayment';
import { pollPayment } from './pollPayment';
import { isFailed } from '../helpers/statusHelper';
import { EVENT_TYPES } from '../../../event/event';
import { createEvent } from '../../../util/db/eventDbService';

const createProposalPaymentValidationSchema = yup.object({
  proposalId: yup.string()
    .uuid()
    .required(),

  ipAddress: yup.string()
    .required(),

  sessionId: yup.string()
    .required()
});

interface ICreatePaymentOptions {
  /**
   * Whether error will be thrown if the payment fails
   */
  throwOnFailure: boolean;
}

const createPaymentDefaultOptions: ICreatePaymentOptions = {
  throwOnFailure: false
};

/**
 * Creates payment for join request and then updates the join request with payment information
 *
 * @throws { CommonError } - If the proposal is of subscription join type
 * @throws { PaymentError } - If the payment fails and the throw option is true
 *
 * @param payload
 */
export const createProposalPayment = async (payload: yup.InferType<typeof createProposalPaymentValidationSchema>, createPaymentOptions?: Partial<ICreatePaymentOptions>): Promise<IProposalPayment> => {
  const options = {
    ...createPaymentDefaultOptions,
    ...createPaymentOptions
  };

  // Validate the data
  await validate(payload, createProposalPaymentValidationSchema);

  // Find the proposal
  const proposal = await proposalDb.getJoinRequest(payload.proposalId);

  // Check if the proposal is with the correct contribution type
  if (proposal.join.fundingType !== 'one-time') {
    throw new CommonError(
      'Cannot create proposal payment for proposals that are not of funding type `one-time`. ' +
      'For charging subscription proposals you must use `createSubscriptionPayment`!', {
        proposalId: proposal.id
      });
  }

  // The cardID and if the user is the owner of that card will be validated in that function. Also the Id of the
  // proposal will be used as idempotency key, so we are insured that only one payment will be made for one proposal
  // (of one-time type)
  let payment = await createPayment({
    userId: proposal.proposerId,
    cardId: proposal.join.cardId,
    ipAddress: payload.ipAddress,
    sessionId: payload.sessionId,

    type: 'one-time',
    amount: proposal.join.funding,
    objectId: proposal.id
  });

  // Attach the payment to the proposal
  await proposalDb.update({
    ...proposal,
    paymentState: 'pending',
    join: {
      ...proposal.join,
      payments: [
        ...(proposal.join.payments || []),
        payment.id
      ]
    }
  });

  logger.info(`Starting polling payment with ID ${payment.id}`, {
    payment
  });

  // Poll the payment
  payment = await pollPayment(payment);

  logger.info(`Polling finished for payment with ID ${payment.id} with status ${payment.status}`, {
    payment
  });

  await createEvent({
    type: payment.status === 'failed'
      ? EVENT_TYPES.PAYMENT_FAILED
      : payment.status === 'paid'
        ? EVENT_TYPES.PAYMENT_PAID
        : payment.status === 'confirmed'
          ? EVENT_TYPES.PAYMENT_CONFIRMED
          : EVENT_TYPES.PAYMENT_UPDATED,
    objectId: payment.id,
    userId: payment.userId
  });


  // Update the payment status
  await proposalDb.update({
    ...proposal,
    paymentState: payment.status === 'paid'
      ? 'confirmed'
      : payment.status
  });
  // payment was successful -> notify user he's now a member
  if (payment.status === 'confirmed') {
    await createEvent({
      type: EVENT_TYPES.REQUEST_TO_JOIN_EXECUTED,
      userId: proposal.proposerId,
      objectId: proposal.id
    });
  }

  if (options.throwOnFailure && isFailed(payment)) {
    throw new PaymentError(payment.id, payment.circlePaymentId);
  }

  // Return the payment
  return payment as IProposalPayment;
};