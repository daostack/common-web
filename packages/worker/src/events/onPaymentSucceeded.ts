import { EventHookHandler } from './index';

export const onPaymentSucceeded: EventHookHandler = async (data, event) => {
  if (event.type === 'PaymentSucceeded') {
    console.log('successful payment', data, event);
  }
};