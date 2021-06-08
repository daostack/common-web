import { PayoutApproverResponse } from '@prisma/client';
import { enumType } from 'nexus';

export const PayoutApproverResponseEnum = enumType({
  name: 'PayoutApproverResponse',
  members: Object.keys(PayoutApproverResponse)
});