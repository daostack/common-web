import { PayoutType } from './types/Payout.type';
import { PayoutSecurityType } from './types/PayoutSecurity.type';

import { PayoutProposalsExtension } from './extensions/PayoutProposals.extension';

import { PayoutStatusEnum } from './enums/PayoutStatus.enum';

import { ExecutePayoutsInput } from './inputs/ExecutePayouts.input';

import { ExecutePayoutsMutation } from './mutations/ExecutePayouts.mutation';
import { ApprovePayoutMutation } from './mutations/ApprovePayout.mutation';

import { GetPayoutQuery } from './queries/GetPayout.query';
import { GetPayoutsQuery } from './queries/GetPayouts.query';

export const PayoutTypes = [
  PayoutType,
  PayoutSecurityType,

  PayoutProposalsExtension,

  PayoutStatusEnum,

  ExecutePayoutsInput,

  ExecutePayoutsMutation,
  ApprovePayoutMutation,

  GetPayoutQuery,
  GetPayoutsQuery
]