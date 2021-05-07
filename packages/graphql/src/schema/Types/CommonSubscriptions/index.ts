import { CommonSubscriptionType } from './Types/CommonSubscription.type';
import { SubscriptionPaymentStatusEnum } from './Enums/SubscriptionPaymentStatus.enum';
import { SubscriptionStatusEnum } from './Enums/SubscriptionStatus.enum';
import { SubscriptionCommonExtension } from './Extensions/SubscriptionCommon.extension';

export const CommonSubscriptionTypes = [
  CommonSubscriptionType,

  SubscriptionPaymentStatusEnum,
  SubscriptionStatusEnum,

  SubscriptionCommonExtension
];