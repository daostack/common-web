import { setQueues, BullAdapter } from 'bull-board';

import { votingQueue } from '../../services/votes/queue';

import { paymentStatusProcessingQueue } from '../../services/payments/queue/paymentProcessingQueue';
import { processProposalPaymentQueue } from '../../services/payments/queue/processProposalPaymentQueue';
import { finalizeProposalQueue } from '../../services/proposals/queue/finalizeProposalQueue';
import { expireProposalsQueue } from '../../services/proposals/queue/expireProposalsQueue';
import { chargeSubscriptionQueue } from '../../services/subscriptions/queues/chargeSubscriptionQueue';

setQueues([
  new BullAdapter(votingQueue),
  new BullAdapter(paymentStatusProcessingQueue),
  new BullAdapter(processProposalPaymentQueue),

  new BullAdapter(finalizeProposalQueue),
  new BullAdapter(expireProposalsQueue),

  new BullAdapter(chargeSubscriptionQueue)
]);