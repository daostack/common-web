import { IJoinRequestProposal } from '@common/types';

import { EVENT_TYPES } from '../../../../../event/event';
import { proposalDb } from '../../../../../proposals/database';
import { createEvent } from '../../../../../util/db/eventDbService';
import { CommonError } from '../../../../../util/errors';
import { isFailed } from '../../../helpers';
import { IPaymentEntity } from '../../../types';

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