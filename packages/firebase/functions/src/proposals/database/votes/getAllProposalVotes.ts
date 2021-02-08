import { firestore } from 'firebase-admin';
import { IVoteEntity } from '@common/types';

import { VotesCollection } from '../index';


/**
 * Returns array of all votes casted to the proposal
 *
 * @param proposalId - The ID of the proposal for witch we want to retrieve the proposals
 */
export const getAllProposalVotes = async (proposalId: string): Promise<IVoteEntity[]> => {
  const votes = await VotesCollection
    .where('proposalId', '==', proposalId)
    .get() as firestore.QuerySnapshot<IVoteEntity>;

  return votes.docs.map(x => x.data());
};