import { IProposalEntity } from '../../proposalTypes';
import { voteDb, votesCollection } from '../../database/votes';
import { CommonError } from '../../../util/errors';

/**
 * Check if user is voter for proposal
 *
 * @param proposal - The proposal entity
 * @param voterId - The ID of the voter that we want to verify is voter
 */
export const hasVoted = async (proposal: IProposalEntity, voterId: string): Promise<boolean> => {
  if (proposal.votes.some(x => x.voterId === voterId)) {
    return true;
  }

  const votes = await voteDb.getAllProposalVotes(proposal.id);

  if (votes.some(x => x.voterId === voterId)) {
    // This is bad and should never be the case. But may happen
    console.error(new CommonError('Proposal vote was not on the proposal doc, but is in the votes collection', {
      proposal,
      votes
    }));

    // @todo Update the proposal doc

    return true;
  }

  return false;
};
