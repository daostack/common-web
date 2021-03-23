import { createCommonCommand } from './command/createCommonCommand';
import { addCommonMemberRoleCommand } from './command/addCommonMemberRoleCommand';
import { createCommonMemberCommand } from './command/createCommonMemberCommand';

export const commonService = {
  create: createCommonCommand,
  createMember: createCommonMemberCommand,

  addCommonMemberRole: addCommonMemberRoleCommand
};