import { PaymentTypeEnum } from './enums/PaymentType.enum';
import { PaymentCircleStatusEnum } from './enums/CirclePaymentStatus.enum';
import { PaymentStatusEnum } from './enums/PaymentStatus.enum';

import { PaymentType } from './type/Payment.type';

import { GetPaymentsQuery } from './queries/GetPayments.Query';
import { PaymentsWhereInput } from './Inputs/PaymentWhere.input';
import { PaymentUserExtension } from './Extensions/PaymentUser.extension';
import { PaymentCommonExtension } from './Extensions/PaymentCommon.extension';

export const PaymentTypes = [
  PaymentTypeEnum,
  PaymentStatusEnum,
  PaymentCircleStatusEnum,

  PaymentType,

  GetPaymentsQuery,

  PaymentsWhereInput,
  PaymentUserExtension,
  PaymentCommonExtension
];