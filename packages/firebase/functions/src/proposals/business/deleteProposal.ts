import { IProposalEntity } from '@common/types';
import { proposalDb, voteDb } from '../database';

/**
 * Tries to delete the proposal from the database and all it's related entities
 *
 * @param proposal - The proposal to delete
 */
export const deleteProposal = async (proposal: IProposalEntity): Promise<void> => {
  // Find and delete all votes that this proposal owns
  const deleteProposalVotesPromiseArr: Promise<any>[] = [];
  const votes = await voteDb.getAllProposalVotes(proposal.id);

  votes.forEach(vote => deleteProposalVotesPromiseArr.push(voteDb.delete(vote.id)));

  await Promise.all(deleteProposalVotesPromiseArr);

  // Delete the proposal
  await proposalDb.delete(proposal.id);

  logger.info('Successfully deleted proposal and related votes', {
    proposal,
    votes
  });
};