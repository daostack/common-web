import { IJoinRequestProposal } from '../../../../../proposals/proposalTypes';
import { isFailed, isPending, isSuccessful } from '../../../helpers';
import { CommonError } from '../../../../../util/errors';
import { IPaymentEntity } from '../../../types';

import { handleSuccessfulJoinPayment } from './handleSuccessfulJoinPayment';
import { handleUnsuccessfulJoinPayment } from './handleFailedJoinPayment';

export const handleFinalizedJoinPayment = async (proposal: IJoinRequestProposal, payment: IPaymentEntity): Promise<void> => {
  if (isPending(payment)) {
    logger.error('Not finalized payment passed to `handleFinalizedJoinPayment()`', {
      payment
    });

    return;
  }

  // Handle successful payment
  if (isSuccessful(payment)) {
    await handleSuccessfulJoinPayment(proposal, payment);
  }

  // Handle unsuccessful payment
  else if (isFailed(payment)) {
    await handleUnsuccessfulJoinPayment(proposal, payment);
  }

  // Something strange has happened, so we need to be notified
  else {
    throw new CommonError('Something wrong happened while processing the payment', {
      proposal,
      payment
    });
  }
};