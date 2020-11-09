import admin from 'firebase-admin';

import { IVoteEntity } from '../../voteTypes';
import { votesCollection } from './index';

import QuerySnapshot = admin.firestore.QuerySnapshot;


/**
 * Returns array of all votes casted to the proposal
 *
 * @param proposalId - The ID of the proposal for witch we want to retrieve the proposals
 */
export const getAllProposalVotes = async (proposalId: string): Promise<IVoteEntity[]> => {
  const votes = await votesCollection
    .where('proposalId', '==', proposalId)
    .get() as QuerySnapshot<IVoteEntity>;

  return votes.docs.map(x => x.data());
};