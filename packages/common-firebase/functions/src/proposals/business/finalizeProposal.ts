import { ArgumentError, CommonError } from '../../util/errors';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';

import { updateProposal } from '../database/updateProposal';
import { IProposalEntity } from '../proposalTypes';

import { countVotes } from './countVotes';
import { hasAbsoluteMajority } from './hasAbsoluteMajority';
import { isExpired } from './isExpired';

/**
 * Finalizes (counts votes, changes status and more) the passed proposal
 *
 * @param proposal - The proposal to finalize
 *
 * @throws { ArgumentError } - If the proposal is with falsy value
 *
 * @returns - The finalized proposal
 */
export const finalizeProposal = async (proposal: IProposalEntity): Promise<IProposalEntity> => {
  if (!proposal) {
    throw new ArgumentError('proposal', proposal);
  }

  // If the proposal does not have a majority and is not expired we should not finalize it
  if (!await isExpired(proposal) && !(await hasAbsoluteMajority(proposal))) {
    throw new CommonError('Trying to finalize non expired proposal', {
      proposal
    });
  }

  const votes = countVotes(proposal);

  proposal.state =
    votes.votesFor > votes.votesAgainst &&
    votes.votesFor > 0
      ? 'passed'
      : 'failed';

  await updateProposal(proposal);

  if (proposal.state === 'passed') {
    await createEvent({
      objectId: proposal.id,
      userId: proposal.proposerId,
      type: proposal.type === 'join'
        ? EVENT_TYPES.REQUEST_TO_JOIN_ACCEPTED
        : EVENT_TYPES.FUNDING_REQUEST_ACCEPTED
    });
  } else {
    await createEvent({
      objectId: proposal.id,
      userId: proposal.proposerId,
      type: proposal.type === 'join'
        ? EVENT_TYPES.REQUEST_TO_JOIN_REJECTED
        : EVENT_TYPES.FUNDING_REQUEST_REJECTED
    });
  }

  return proposal;
};