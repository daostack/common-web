import { extendType } from 'nexus';

import { userDb } from '../../../../domain/users/database';

import { UserType } from '../../users/types/User.type';

export const ProposalVoteVoterExtension = extendType({
  type: 'ProposalVote',
  definition(t) {
    t.field('voter', {
      type: UserType,
      resolve: (root) => {
        return userDb.get(root.voterId);
      },
    });
  }
})