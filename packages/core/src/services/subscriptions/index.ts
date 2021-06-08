import { paymentService } from '../payments';
import { createSubscriptionCommand } from './command/createSubscriptionCommand';

export const subscriptionService = {
  create: createSubscriptionCommand,
  createPayment: paymentService.createSubscriptionPayment
};