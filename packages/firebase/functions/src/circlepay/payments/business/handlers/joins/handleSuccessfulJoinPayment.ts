import { IJoinRequestProposal } from '@common/types';

import { addCommonMemberByProposalId } from '../../../../../common/business/addCommonMember';
import { updateCommonBalance } from '../../../../../common/business/updateCommonBalance';
import { EVENT_TYPES } from '../../../../../event/event';
import { proposalDb } from '../../../../../proposals/database';
import { createEvent } from '../../../../../util/db/eventDbService';
import { CommonError } from '../../../../../util/errors';
import { isSuccessful } from '../../../helpers';
import { IPaymentEntity } from '../../../types';

export const handleSuccessfulJoinPayment = async (proposal: IJoinRequestProposal, payment: IPaymentEntity): Promise<void> => {
  if (!isSuccessful(payment)) {
    throw new CommonError('Cannot handle successful payment when the payment is not successful', {
      payment
    });
  }

  // Create event for that
  await createEvent({
    type: payment.status === 'confirmed'
      ? EVENT_TYPES.PAYMENT_CONFIRMED
      : EVENT_TYPES.PAYMENT_PAID,
    objectId: payment.id,
    userId: payment.userId
  });


  // Add the user as member of the common
  await addCommonMemberByProposalId(proposal.id);

  // Update common balance info
  await updateCommonBalance(proposal.commonId, proposal.join.funding);

  // Update the status of the proposal
  await proposalDb.update({
    id: proposal.id,
    paymentState: 'confirmed'
  });
};