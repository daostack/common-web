import { createCommonCommand } from './command/createCommonCommand';
import { delistCommonCommand } from './command/delistCommonCommand';
import { whitelistCommonCommand } from './command/whitelistCommonCommand';
import { createCommonMemberCommand } from './command/createCommonMemberCommand';

import { addCommonMemberRoleCommand } from './command/addCommonMemberRoleCommand';
import { getCommonMemberIdQuery } from './queries/getCommonMemberIdQuery';

export const commonService = {
  create: createCommonCommand,
  delist: delistCommonCommand,
  whitelist: whitelistCommonCommand,
  createMember: createCommonMemberCommand,

  addCommonMemberRole: addCommonMemberRoleCommand,

  getMemberId: getCommonMemberIdQuery
};