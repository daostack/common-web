import { createCommonCommand } from './command/createCommonCommand';
import { addCommonMemberRoleCommand } from './command/addCommonMemberRoleCommand';
import { createCommonMemberCommand } from './command/createCommonMemberCommand';

export const commonService = {
  commands: {
    create: createCommonCommand,
    createMember: createCommonMemberCommand,

    addCommonMemberRole: addCommonMemberRoleCommand
  }
};