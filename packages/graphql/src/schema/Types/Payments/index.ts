import { PaymentTypeEnum } from './Enums/PaymentType.enum';
import { PaymentCircleStatusEnum } from './Enums/CirclePaymentStatus.enum';
import { PaymentStatusEnum } from './Enums/PaymentStatus.enum';

import { PaymentType } from './Types/Payment.type';

import { GetPaymentsQuery } from './Queries/GetPayments.query';
import { PaymentsWhereInput } from './Inputs/PaymentWhere.input';
import { PaymentUserExtension } from './Extensions/PaymentUser.extension';
import { PaymentCommonExtension } from './Extensions/PaymentCommon.extension';
import { GetPaymentQuery } from './Queries/GetPayment.query';

export const PaymentTypes = [
  PaymentTypeEnum,
  PaymentStatusEnum,
  PaymentCircleStatusEnum,

  PaymentType,

  GetPaymentQuery,
  GetPaymentsQuery,

  PaymentsWhereInput,
  PaymentUserExtension,
  PaymentCommonExtension
];