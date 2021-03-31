import { setQueues, BullAdapter } from 'bull-board';

import { votingQueue } from '@votes/queue';

import { paymentStatusProcessingQueue } from '../../core/payments/queue/paymentProcessingQueue';
import { processProposalPaymentQueue } from '../../core/payments/queue/processProposalPaymentQueue';
import { finalizeProposalQueue } from '../../core/proposals/queue/finalizeProposalQueue';
import { expireProposalsQueue } from 'core/proposals/queue/expireProposalsQueue';

setQueues([
  new BullAdapter(votingQueue),
  new BullAdapter(paymentStatusProcessingQueue),
  new BullAdapter(processProposalPaymentQueue),

  new BullAdapter(finalizeProposalQueue),
  new BullAdapter(expireProposalsQueue)
]);