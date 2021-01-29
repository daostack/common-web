import { IJoinRequestProposal } from '../../../../../proposals/proposalTypes';
import { IPaymentEntity } from '../../../types';
import { isFailed } from '../../../helpers';
import { CommonError } from '../../../../../util/errors';
import { proposalDb } from '../../../../../proposals/database';
import { EVENT_TYPES } from '../../../../../event/event';
import { createEvent } from '../../../../../util/db/eventDbService';

export const handleUnsuccessfulJoinPayment = async (proposal: IJoinRequestProposal, payment: IPaymentEntity): Promise<void> => {
  if (!isFailed(payment)) {
    throw new CommonError('Cannot handle unsuccessful payment if it is not failed', {
      payment
    });
  }

  // Create the event
  await createEvent({
    type: EVENT_TYPES.PAYMENT_FAILED,
    objectId: payment.id,
    userId: payment.userId
  });

  // Update the status of the proposal
  await proposalDb.update({
    id: proposal.id,
    paymentState: 'failed'
  });
};