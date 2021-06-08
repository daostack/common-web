import { createOneTimePaymentCommand } from './commands/createOneTimePaymentCommand';
import { updatePaymentStatusCommand } from './commands/updatePaymentStatusCommand';
import { processPaymentCommand } from './commands/process/processPaymentCommand';
import { createSubscriptionPaymentCommand } from './commands/createSubscriptionPaymentCommand';

export const paymentService = {
  createOneTimePayment: createOneTimePaymentCommand,
  createSubscriptionPayment: createSubscriptionPaymentCommand,

  updateStatus: updatePaymentStatusCommand,

  process: processPaymentCommand
};