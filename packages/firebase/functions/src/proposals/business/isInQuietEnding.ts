import { IProposalEntity } from '../proposalTypes';

/**
 * Checks if the current proposal is in it's quiet ending period
 *
 * @param proposal
 */
export const isInQuietEnding = (proposal: IProposalEntity): boolean => {
  const now = new Date();
  const expiration = new Date(now.getTime() + (proposal.countdownPeriod * 1000));
  const quietEndingStart = new Date(expiration.getTime() - (proposal.quietEndingPeriod * 1000));

  return now < expiration && now > quietEndingStart;
}