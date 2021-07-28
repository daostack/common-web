import { createCommonCommand } from './command/createCommonCommand';
import { delistCommonCommand } from './command/delistCommonCommand';
import { whitelistCommonCommand } from './command/whitelistCommonCommand';
import { createCommonMemberCommand } from './command/createCommonMemberCommand';

import { addCommonMemberRoleCommand } from './command/addCommonMemberRoleCommand';
import { getCommonMemberIdQuery } from './queries/getCommonMemberIdQuery';
import { updateCommonCommand } from './command/updateCommonCommand';

import { updateCommonBalanceWithPaymentCommand } from './command/updateCommonBalanceWithPaymentCommand';
import { updateCommonBalanceWithFundingRequestCommand } from './command/updateCommonBalanceWithFundingRequestCommand';

export const commonService = {
  create: createCommonCommand,
  update: updateCommonCommand,
  delist: delistCommonCommand,
  whitelist: whitelistCommonCommand,
  createMember: createCommonMemberCommand,

  addCommonMemberRole: addCommonMemberRoleCommand,

  getMemberId: getCommonMemberIdQuery,

  updateBalance: {
    withFundingProposal: updateCommonBalanceWithFundingRequestCommand,
    withPayment: updateCommonBalanceWithPaymentCommand
  }
};