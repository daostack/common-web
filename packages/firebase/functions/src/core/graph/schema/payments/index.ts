import { PaymentTypeEnum } from './enums/PaymentType.enum';
import { PaymentStatusEnum } from './enums/PaymentStatus.enum';
import { PaymentSourceEnum } from './enums/PaymentSource.enum';
import { PaymentCurrencyEnum } from './enums/PaymentCurrency.enum';

import { PaymentType } from './types/Payment.type';
import { PaymentFeesType } from './types/PaymentFees.type';
import { PaymentSourceType } from './types/PaymentSoure.type';
import { PaymentAmountType } from './types/PaymentAmount.type';

import { GetPaymentQuery } from './queries/GetPayment.query';
import { GetPaymentsQuery } from './queries/GetPayments.query';

import { PaymentCardExtension } from './extensions/PaymentCard.extension';
import { PaymentUserExtension } from './extensions/PaymentUser.extension';
import { PaymentCommonExtensions } from './extensions/PaymentCommon.extension';
import { PaymentProposalExtension } from './extensions/PaymentProposal.extension';
import { PaymentSubscriptionExtension } from './extensions/PaymentSubscription.extension';

export const PaymentTypes = [
  PaymentTypeEnum,
  PaymentSourceEnum,
  PaymentStatusEnum,
  PaymentCurrencyEnum,

  PaymentType,
  PaymentFeesType,
  PaymentSourceType,
  PaymentAmountType,

  GetPaymentQuery,
  GetPaymentsQuery,

  PaymentUserExtension,
  PaymentCardExtension,
  PaymentCommonExtensions,
  PaymentProposalExtension,
  PaymentSubscriptionExtension
];