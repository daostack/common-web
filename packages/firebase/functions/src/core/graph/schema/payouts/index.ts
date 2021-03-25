import { PayoutType } from './types/Payout.type';
import { PayoutSecurityType } from './types/PayoutSecurity.type';

import { PayoutProposalsExtension } from './extensions/PayoutProposals.extension';

import { PayoutStatusEnum } from './enums/PayoutStatus.enum';

import { ExecutePayoutsInput } from './inputs/ExecutePayouts.input';

import { ApprovePayoutMutation } from './mutations/ApprovePayout.mutation';
import { ExecutePayoutsMutation } from './mutations/ExecutePayouts.mutation';
import { UpdatePayoutStatusMutation } from './mutations/UpdatePayoutStatus.mutation';
import { UpdatePayoutsStatusMutation } from './mutations/UpdatePayoutsStatus.mutation';

import { GetPayoutQuery } from './queries/GetPayout.query';
import { GetPayoutsQuery } from './queries/GetPayouts.query';

export const PayoutTypes = [
  PayoutType,
  PayoutSecurityType,

  PayoutProposalsExtension,

  PayoutStatusEnum,

  ExecutePayoutsInput,

  ApprovePayoutMutation,
  ExecutePayoutsMutation,
  UpdatePayoutStatusMutation,
  UpdatePayoutsStatusMutation,

  GetPayoutQuery,
  GetPayoutsQuery
]