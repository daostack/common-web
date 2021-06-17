import { EventHandler } from './index';

export const onPaymentSucceeded: EventHandler = async (data, event) => {
  if (event.type === 'PaymentSucceeded') {
    console.log('successful payment', data, event);
  }
};