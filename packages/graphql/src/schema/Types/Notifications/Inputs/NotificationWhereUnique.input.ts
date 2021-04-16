import { inputObjectType } from 'nexus';

export const NotificationWhereUniqueInput = inputObjectType({
  name: 'NotificationWhereUniqueInput',
  definition(t) {
    t.uuid('id');
  }
});