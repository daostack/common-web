import admin from 'firebase-admin';

import { proposalsCollection } from './index';
import { IProposalEntity, ProposalState } from '../proposalTypes';
import QuerySnapshot = admin.firestore.QuerySnapshot;

interface IGetProposalsOptions {
  state?: ProposalState | ProposalState[];
}

/**
 * Returns array of all votes casted to the proposal
 *
 * @param proposalId - The ID of the proposal for witch we want to retrieve the proposals
 */
export const getProposals = async (options: IGetProposalsOptions): Promise<IProposalEntity[]> => {
  const proposalsQuery = await proposalsCollection;

  if (options.state) {
    const operator = typeof options.state === 'string' ? '==' : 'in';

    proposalsQuery.where('state', operator, options.state);
  }

  return (await proposalsQuery.get() as QuerySnapshot<IProposalEntity>)
    .docs.map(x => x.data());
};