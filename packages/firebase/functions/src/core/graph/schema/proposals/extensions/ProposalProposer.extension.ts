import { extendType } from 'nexus';

import { UserType } from '../../users/user';
import { userDb } from '../../../../domain/users/database';

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