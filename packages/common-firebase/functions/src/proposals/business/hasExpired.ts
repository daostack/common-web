import { IProposalEntity } from '../proposalTypes';
import { ArgumentError } from '../../util/errors';
import { finalizeProposal } from './finalizeProposal';

/**
 * Returns whether the passed proposal has expired or
 * not. If the proposal is expired, but not
 * finalized it will be finalized
 *
 * @param proposal - The proposal to check
 * @param finalize - Whether the proposal should be finalized. *Default - true*
 *
 * @throws { ArgumentError } - If the passed proposal is with falsy value
 *
 * @returns - Promise resolved in boolean, the result
 */
export const hasExpired = async (proposal: IProposalEntity, finalize = true): Promise<boolean> => {
  if (!proposal) {
    throw new ArgumentError('proposal', proposal);
  }

  if (proposal.state !== 'countdown') {
    return true;
  }

  const now = new Date();
  const expiration = new Date(now.getTime() + (proposal.countdownPeriod * 1000));

  // If the expiration is in the past it is therefore expired
  if (expiration < now) {
    if (finalize) {
      // If the expiration is in the past and the proposal is
      // not finalized maybe we should finalize it
      await finalizeProposal(proposal);
    }

    return true;
  }

  return false;
};