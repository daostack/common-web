import { DiscussionType } from '@prisma/client';
import { enumType } from 'nexus';

export const DiscussionTypeEnum = enumType({
  name: 'DiscussionType',
  members: DiscussionType
});