import admin from 'firebase-admin';

import { ProposalsCollection } from './index';
import { FundingRequestState, IProposalEntity, ProposalType, RequestToJoinState } from '../proposalTypes';
import QuerySnapshot = admin.firestore.QuerySnapshot;

interface IGetProposalsOptions {
  state?: RequestToJoinState | RequestToJoinState[] | FundingRequestState | FundingRequestState[];
  type?: ProposalType;
  proposerId?: string;
  commonId?: string;
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

  return (await proposalsQuery.get() as QuerySnapshot<IProposalEntity>)
    .docs.map(x => x.data());
};