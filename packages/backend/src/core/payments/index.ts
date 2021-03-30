import { createOneTimePaymentCommand } from './command/createOneTimePaymentCommand';
import { finalizePaymentCommand } from './command/finalizePaymentCommand';

export const paymentService = {
  createOneTimePayment: createOneTimePaymentCommand,

  finalizePayment: finalizePaymentCommand
};