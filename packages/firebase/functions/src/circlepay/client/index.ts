import { getPaymentFromCircle } from './getPaymentFromCircle';
import { getCardFromCircle } from './getCardFromCircle';
import { getBankAccountFromCircle } from './getBankAccountFromCircle';
import { getBalanceFromCircle } from './getBalanceFromCircle';

export { ICircleCard, CircleCardNetwork } from './getCardFromCircle';

export const circleClient = {
  getPayment: getPaymentFromCircle,
  getCard: getCardFromCircle,
  getBankAccount: getBankAccountFromCircle,
  getBalance: getBalanceFromCircle
}