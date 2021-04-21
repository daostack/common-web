import { UserNotificationTokenState } from '@prisma/client';
import { enumType } from 'nexus';

export const UserNotificationTokenStateEnum = enumType({
  name: 'UserNotificationTokenState',
  members: UserNotificationTokenState
});