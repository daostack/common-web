import { PaymentTypeEnum } from './enums/PaymentType.enum';
import { PaymentCircleStatusEnum } from './enums/CirclePaymentStatus.enum';
import { PaymentStatusEnum } from './enums/PaymentStatus.enum';

import { PaymentType } from './type/Payment.type';

import { GetPaymentsQuery } from './queries/GetPayments.Query';

export const PaymentTypes = [
  PaymentTypeEnum,
  PaymentStatusEnum,
  PaymentCircleStatusEnum,

  PaymentType,

  GetPaymentsQuery
];