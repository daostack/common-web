import { IProposalEntity } from '../proposalTypes';
import { ArgumentError } from '../../util/errors';

/**
 * Returns whether the passed proposal has expired or
 * not. If the proposal is expired, but not
 * finalized it will be finalized
 *
 * @param proposal - The proposal to check
 *
 * @throws { ArgumentError } - If the passed proposal is with falsy value
 *
 * @returns - Promise resolved in boolean, the result
 */
export const isExpired = async (proposal: IProposalEntity): Promise<boolean> => {
  if (!proposal) {
    throw new ArgumentError('proposal', proposal);
  }

  if (['passed', 'failed'].includes(proposal.state)) {
    return true;
  }

  const now = new Date();
  const expiration = new Date(proposal.createdAt.getTime() + (proposal.countdownPeriod * 1000));

  // If the expiration is in the past it is therefore expired
  return expiration < now;
};