import Queue from 'bull';
import { Payment } from '@prisma/client';

import { Queues } from '@constants';
import { processPaymentCommand } from '../commands/process/processPaymentCommand';

interface IProcessProposalPaymentQueue {
  payment: Payment;
}

export const processProposalPaymentQueue = Queue<IProcessProposalPaymentQueue>(Queues.ProcessProposalPayment);

export const addProcessProposalPaymentJob = (payment: Payment) => {
  processProposalPaymentQueue.add({
    payment
  }, {
    timeout: 60 * 60 * 1000 // 1 hour
  });
};

processProposalPaymentQueue.process(async (job, done) => {
  await processPaymentCommand(job.data.payment.id);

  done();
});