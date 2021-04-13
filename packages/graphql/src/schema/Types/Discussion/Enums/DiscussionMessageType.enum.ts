import { enumType } from 'nexus';
import { DiscussionMessageType } from '@prisma/client';

export const DiscussionMessageTypeEnum = enumType({
  name: 'DiscussionMessageType',
  members: DiscussionMessageType
});