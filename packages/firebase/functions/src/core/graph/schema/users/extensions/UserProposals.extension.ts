import { extendType, intArg } from 'nexus';

import { CommonError } from '../../../../../util/errors';
import { proposalDb } from '../../../../../proposals/database';

import { ProposalType } from '../../proposals/types/Proposal.type';

export const UserProposalsExtension = extendType({
  type: 'User',
  definition(t) {
    t.list.field('proposals', {
      type: ProposalType,
      args: {
        page: intArg({
          default: 1
        })
      },
      resolve: (root: any, args) => {
        if (args.page < 1) {
          throw new CommonError('Request at least the first page');
        }

        return proposalDb.getMany({
          proposerId: root.id || root.uid,
          last: 10,
          after: (args.page - 1) * 10
        }) as any;
      }
    });
  }
});