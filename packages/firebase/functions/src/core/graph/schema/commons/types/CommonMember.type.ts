import { objectType } from 'nexus';

export const CommonMemberType = objectType({
  name: 'CommonMember',
  definition(t) {
    t.nonNull.id('userId', {
      description: 'The user ID of the member'
    });

    t.date('joinedAt', {
      description: 'The date, at witch the member joined the common'
    });
  }
});
