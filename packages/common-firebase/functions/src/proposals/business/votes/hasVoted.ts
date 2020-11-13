import { IProposalEntity } from '../../proposalTypes';

/**
 * Check if user is voter for proposal
 *
 * @param proposal - The proposal entity
 * @param voterId - The ID of the voter that we want to verify is voter
 */
export const hasVoted = async (proposal: IProposalEntity, voterId: string): Promise<boolean> =>
  proposal.votes.some(x => x.voterId === voterId);
