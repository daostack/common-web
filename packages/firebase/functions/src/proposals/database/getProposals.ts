import {
  FundingRequestState,
  IProposalEntity,
  ProposalType,
  RequestToJoinState,
  ProposalFundingState
} from '@common/types';
import { firestore } from 'firebase-admin';

import { ProposalsCollection } from './index';
import { CommonError } from '../../util/errors';

export interface IGetProposalsOptions {
  state?: RequestToJoinState | RequestToJoinState[] | FundingRequestState | FundingRequestState[];
  type?: ProposalType;
  proposerId?: string;
  commonId?: string;

  /**
   * Get the proposals for the ids. If the ID is not found no error will be thrown!
   */
  ids?: string[];

  fundingState?: ProposalFundingState;

  /**
   * Get the last {number} of elements sorted
   * by createdAt date
   */
  last?: number;

  /**
   * Get the first {number} of elements sorted
   * by createdAt date
   */
  first?: number;

  /**
   * If sorting skip {number} elements
   */
  after?: number;
}

/**
 * Returns array of all votes casted to the proposal
 *
 * @param options - List of params that all of the returned proposal must match
 */
export const getProposals = async (options: IGetProposalsOptions): Promise<IProposalEntity[]> => {
  let proposalsQuery: any = ProposalsCollection;

  if (options.state) {
    const operator = typeof options.state === 'string' ? '==' : 'in';

    proposalsQuery = proposalsQuery.where('state', operator, options.state);
  }

  if (options.type) {
    proposalsQuery = proposalsQuery.where('type', '==', options.type);
  }

  if (options.proposerId) {
    proposalsQuery = proposalsQuery.where('proposerId', '==', options.proposerId);
  }

  if (options.commonId) {
    proposalsQuery = proposalsQuery.where('commonId', '==', options.commonId);
  }

  if (options.fundingState) {
    proposalsQuery = proposalsQuery
      .where('fundingState', '==', options.fundingState);
  }

  if (options.ids) {
    proposalsQuery = proposalsQuery.where('id', 'in', options.ids);
  }

  // Sorting and paging
  if (options.first || options.last) {
    const { first, last, after } = options;

    if (first && last) {
      throw new CommonError('Only first or only last can be selected, not both!');
    }

    if (first) {
      proposalsQuery = proposalsQuery
        .orderBy('createdAt', 'asc')
        .limit(first);
    }

    if (last) {
      proposalsQuery = proposalsQuery
        .orderBy('createdAt', 'desc')
        .limit(last);
    }

    if (after && after > 0) {
      proposalsQuery = proposalsQuery
        .offset(after);
    }
  }

  return (await proposalsQuery.get() as firestore.QuerySnapshot<IProposalEntity>)
    .docs.map(x => x.data());
};