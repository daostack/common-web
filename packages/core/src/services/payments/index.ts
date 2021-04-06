import { createOneTimePaymentCommand } from './commands/createOneTimePaymentCommand';
import { updatePaymentStatusCommand } from './commands/updatePaymentStatusCommand';
import { processPaymentCommand } from './commands/process/processPaymentCommand';

export const paymentService = {
  createOneTimePayment: createOneTimePaymentCommand,

  updateStatus: updatePaymentStatusCommand,

  process: processPaymentCommand
};