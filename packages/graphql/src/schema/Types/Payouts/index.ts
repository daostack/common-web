import { PayoutType } from './Types/Payout.type';
import { PayoutStatusEnum } from './Enums/PayoutStatus.enum';
import { GetPayoutsQuery } from './Queries/GetPayouts.query';

export const PayoutTypes = [
  PayoutType,
  PayoutStatusEnum,

  GetPayoutsQuery
];