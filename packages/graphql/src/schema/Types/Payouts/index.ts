import { PayoutType } from './Types/Payout.type';
import { PayoutApproverType } from './Types/PayoutApprover.type';

import { PayoutStatusEnum } from './Enums/PayoutStatus.enum';
import { PayoutApproverResponseEnum } from './Enums/PayoutApproverResponse.enum';

import { GetPayoutQuery } from './Queries/GetPayout.query';
import { GetPayoutsQuery } from './Queries/GetPayouts.query';
import { CreatePayoutMutation } from './Mutations/CreatePayout.mutation';
import { ApprovePayoutMutation } from './Mutations/ApprovePayout.mutation';

import { PayoutWhereInput } from './Inputs/PayoutWhere.input';
import { PayoutStatusFilterInput } from './Inputs/PayoutStatusFilter.input';
import { PayoutApproversWhereInput } from './Inputs/PayoutApproversWhere.input';
import { PayoutApproverFilterInput } from './Inputs/PayoutApproverFilter.input';

import { PayoutProposalsExtension } from './Extensions/PayoutProposals.extension';
import { PayoutWireExtension } from './Extensions/PayoutWire.extension';

export const PayoutTypes = [
  PayoutType,
  PayoutApproverType,

  PayoutStatusEnum,
  PayoutApproverResponseEnum,

  GetPayoutQuery,
  GetPayoutsQuery,
  CreatePayoutMutation,
  ApprovePayoutMutation,

  PayoutApproverFilterInput,
  PayoutApproversWhereInput,
  PayoutStatusFilterInput,
  PayoutWhereInput,

  PayoutProposalsExtension,
  PayoutWireExtension
];