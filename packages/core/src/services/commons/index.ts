import { createCommonCommand } from './command/createCommonCommand';
import { delistCommonCommand } from './command/delistCommonCommand';
import { whitelistCommonCommand } from './command/whitelistCommonCommand';
import { createCommonMemberCommand } from './command/createCommonMemberCommand';

import { addCommonMemberRoleCommand } from './command/addCommonMemberRoleCommand';
import { getCommonMemberIdQuery } from './queries/getCommonMemberIdQuery';
import { updateCommonCommand } from './command/updateCommonCommand';

export const commonService = {
  create: createCommonCommand,
  update: updateCommonCommand,
  delist: delistCommonCommand,
  whitelist: whitelistCommonCommand,
  createMember: createCommonMemberCommand,

  addCommonMemberRole: addCommonMemberRoleCommand,

  getMemberId: getCommonMemberIdQuery
};