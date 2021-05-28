import { PayoutType } from './Types/Payout.type';
import { PayoutStatusEnum } from './Enums/PayoutStatus.enum';

import { GetPayoutsQuery } from './Queries/GetPayouts.query';
import { CreatePayoutMutation } from './Mutations/CreatePayout.mutation';
import { PayoutApproverResponseEnum } from './Enums/PayoutApproverResponse.enum';
import { PayoutApproverType } from './Types/PayoutApprover.type';
import { ApprovePayoutMutation } from './Mutations/ApprovePayout.mutation';

export const PayoutTypes = [
  PayoutType,
  PayoutApproverType,

  PayoutStatusEnum,
  PayoutApproverResponseEnum,

  GetPayoutsQuery,
  CreatePayoutMutation,
  ApprovePayoutMutation
];