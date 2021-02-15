import { PayoutType } from './types/Payout.type';
import { PayoutSecurityType } from './types/PayoutSecurity.type';

import { PayoutProposalsExtension } from './extensions/PayoutProposals.extension';

import { PayoutStatusEnum } from './enums/PayoutStatus.enum';

import { ExecutePayoutsInput } from './inputs/ExecutePayouts.input';

import { ExecutePayoutsMutation } from './mutations/ExecutePayouts.mutation';

import { GetPayoutQuery } from './queries/GetPayout.query';
import { GetPayoutsQuery } from './queries/GetPayouts.query';

export const PayoutTypes = [
  PayoutType,
  PayoutSecurityType,

  PayoutProposalsExtension,

  PayoutStatusEnum,

  ExecutePayoutsInput,

  ExecutePayoutsMutation,

  GetPayoutQuery,
  GetPayoutsQuery
]