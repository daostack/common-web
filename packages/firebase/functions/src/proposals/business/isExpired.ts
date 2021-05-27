import { IProposalEntity } from '@common/types';
import { ArgumentError } from '../../util/errors';
import { FLAGS } from '../../moderation/constants';
import { firestore } from 'firebase-admin';

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

  const {moderation} = proposal;

  if (['passed', 'failed'].includes(proposal.state)) {
    return true;
  }

  const now = (firestore.Timestamp.now()).toDate();
  // If the proposal changed from hidden to visible, we start the countdown from the time it was changed to visible and not 
  const startTime = moderation?.flag && moderation?.flag !== FLAGS.reported
    ? moderation?.updatedAt?.toDate().getTime()
    : proposal.createdAt.toDate().getTime();
    
  const expiration = new Date(startTime + (proposal.moderation.countdownPeriod * 1000));
  // If the expiration is in the past it is therefore expired
  return expiration < now;
};