import { getPaymentFromCircle } from './getPaymentFromCircle';
import { getCardFromCircle } from './getCardFromCircle';

export { ICircleCard, CircleCardNetwork } from './getCardFromCircle';

export const circleClient = {
  getPayment: getPaymentFromCircle,
  getCard: getCardFromCircle
}