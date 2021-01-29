import { getPaymentFromCircle } from './getPaymentFromCircle';
import { getCardFromCircle } from './getCardFromCircle';
import { getBankAccountFromCircle } from './getBankAccountFromCircle';

export { ICircleCard, CircleCardNetwork } from './getCardFromCircle';

export const circleClient = {
  getPayment: getPaymentFromCircle,
  getCard: getCardFromCircle,
  getBankAccount: getBankAccountFromCircle
}