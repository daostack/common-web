import { enumType } from 'nexus';
import { DiscussionMessageFlag } from '@prisma/client';

export const DiscussionMessageFlagEnum = enumType({
  name: 'DiscussionMessageFlag',
  members: DiscussionMessageFlag
});