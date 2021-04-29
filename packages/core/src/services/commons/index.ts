import { createCommonCommand } from './command/createCommonCommand';
import { createCommonMemberCommand } from './command/createCommonMemberCommand';
import { addCommonMemberRoleCommand } from './command/addCommonMemberRoleCommand';

import { getCommonMemberIdQuery } from './queries/getCommonMemberIdQuery';
import { whitelistCommonCommand } from './command/whitelistCommonCommand';

export const commonService = {
  create: createCommonCommand,
  whitelist: whitelistCommonCommand,
  createMember: createCommonMemberCommand,

  addCommonMemberRole: addCommonMemberRoleCommand,

  getMemberId: getCommonMemberIdQuery
};