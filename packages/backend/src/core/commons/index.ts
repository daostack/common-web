import { createCommonCommand } from './command/createCommonCommand';
import { createCommonMemberCommand } from './command/createCommonMemberCommand';
import { addCommonMemberRoleCommand } from './command/addCommonMemberRoleCommand';

import { getCommonMemberIdQuery } from './queries/getCommonMemberIdQuery';

export const commonService = {
  create: createCommonCommand,
  createMember: createCommonMemberCommand,

  addCommonMemberRole: addCommonMemberRoleCommand,

  getMemberId: getCommonMemberIdQuery
};