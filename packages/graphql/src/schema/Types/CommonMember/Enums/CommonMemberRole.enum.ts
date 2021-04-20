import { enumType } from 'nexus';
import { CommonMemberRole } from '@prisma/client';

export const CommonMemberRoleEnum = enumType({
  name: 'CommonMemberRole',
  members: CommonMemberRole
});