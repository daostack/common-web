import { objectType } from 'nexus';
import { IProposalVote } from '@common/types';

import { ProposalVoteOutcomeEnum } from '../enums/ProposalVoteOutcome.enum';

export const ProposalVoteType = objectType({
  name: 'ProposalVote',
  definition(t) {
    t.nonNull.id('voteId');
    t.nonNull.id('voterId');

    t.nonNull.field('outcome', {
      type: ProposalVoteOutcomeEnum,
      resolve: ((root: IProposalVote) => root.voteOutcome) as any,
    });
  },
});
