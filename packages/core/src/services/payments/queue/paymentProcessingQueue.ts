// import Queue from 'bull';
// import { PaymentStatus } from '@prisma/client';
//
//
// // import { Queues } from '@constants';
// import { logger } from '@logger';
// import { updatePaymentStatusCommand } from '../commands/updatePaymentStatusCommand';
// import { addProcessProposalPaymentJob } from './processProposalPaymentQueue';
//
// interface IPaymentProcessingQueueJob {
//   paymentId: string;
//   retries: number;
// }
//
// export const paymentStatusProcessingQueue = new Queue<IPaymentProcessingQueueJob>(Queues.PaymentsProcessingQueue);
//
// export const addPaymentStatusProcessingJob = (paymentId: string, retries = 0): void => {
//   paymentStatusProcessingQueue.add({
//     paymentId,
//     retries
//   }, {
//     delay: retries * 1000,
//     timeout: 10 * 60 * 1000 // 10 minutes
//   });
// };
//
// paymentStatusProcessingQueue.process(async (job, done) => {
//   logger.info('Processing payment', {
//     job: 'IPaymentProcessingQueueJob',
//     jobData: job.data
//   });
//
//   const { data } = job;
//
//   const { updatedPayment } = await updatePaymentStatusCommand(data.paymentId);
//
//
//   if (
//     updatedPayment.status === PaymentStatus.Unsuccessful ||
//     updatedPayment.status === PaymentStatus.Successful
//   ) {
//     addProcessProposalPaymentJob(updatedPayment);
//   } else {
//     addPaymentStatusProcessingJob(data.paymentId, data.retries + 1);
//   }
//
//   done();
// });