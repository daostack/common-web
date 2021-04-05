import { createOneTimePaymentCommand } from './commands/createOneTimePaymentCommand';
import { updatePaymentStatusCommand } from './commands/updatePaymentStatusCommand';

export const paymentService = {
  createOneTimePayment: createOneTimePaymentCommand,

  updateStatus: updatePaymentStatusCommand
};