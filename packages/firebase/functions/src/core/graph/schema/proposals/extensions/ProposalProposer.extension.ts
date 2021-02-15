import { extendType } from 'nexus';

import { userDb } from '../../../../domain/users/database';

import { UserType } from '../../users/types/User.type';

export const ProposalProposerExtension = extendType({
  type: 'Proposal',
  definition(t) {
    t.nonNull.field('proposer', {
      type: UserType,
      resolve: (root) => {
        return userDb.get(root.proposerId);
      }
    });
  }
});