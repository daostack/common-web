import { arg, extendType, intArg, list, stringArg } from 'nexus';

import { CommonError } from '../../../../../util/errors';
import { proposalDb } from '../../../../../proposals/database';
import { IGetProposalsOptions } from '../../../../../proposals/database/getProposals';

import { ProposalType } from '../types/Proposal.type';

import { ProposalTypeEnum } from '../enums/ProposalType.enum';
import { ProposalFundingStateEnum } from '../enums/ProposalFundingState.enum';

export const GetProposalsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('proposals', {
      type: ProposalType,
      args: {
        ids: list(stringArg()),

        page: intArg({
          default: 1
        }),

        pageItems: intArg({
          default: 10
        }),

        type: arg({
          type: ProposalTypeEnum
        }),

        fundingState: arg({
          type: ProposalFundingStateEnum
        })
      },
      resolve: (root, args) => {
        // --- Validation
        if (args.type && args.funded) {
          throw new CommonError(
            'You can only select proposal type or proposal funding type, but not both'
          );
        }

        if (args.page <= 0) {
          throw new CommonError(
            'The page must be at least one'
          );
        }

        if (args.pageItems < 1 || args.pageItems > 100) {
          throw new CommonError(
            'The items per page cannot be less than 1 or more than 100'
          );
        }

        // --- Fetching
        const options: IGetProposalsOptions = {
          first: args.pageItems,
          after: (args.page - 1) * args.pageItems,

          ...args
        };

        return proposalDb.getMany(options);
      }
    });
  }
});