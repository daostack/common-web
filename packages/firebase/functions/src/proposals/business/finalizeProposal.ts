import { IProposalEntity } from '@common/types';
import { ArgumentError, CommonError } from '../../util/errors';
import { createEvent } from '../../util/db/eventDbService';
import { EVENT_TYPES } from '../../event/event';

import { updateProposal } from '../database/updateProposal';

import { countVotes } from './countVotes';
import { hasAbsoluteMajority } from './hasAbsoluteMajority';
import { isExpired } from './isExpired';
import { commonDb } from '../../common/database';

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

  // If the votes for are more than the votes against give it pass (
  proposal.state =
    votes.votesFor > votes.votesAgainst &&
    votes.votesFor > 0
      ? 'passed'
      : 'failed';

  // Check if the proposal is accepted and for funding check if there is actually enough balance for it
  if (proposal.type === 'fundingRequest' && proposal.state === 'passed') {
    const common = await commonDb.get(proposal.commonId);

    if (common.balance < proposal.fundingRequest.amount) {
      logger.info('Common lacks the funds required to fund passed proposal', {
        common,
        proposal
      });

      // Change the state of the proposal
      proposal.state = 'passedInsufficientBalance';
      proposal.fundingState = 'notAvailable';

      // Create an event
      await createEvent({
        objectId: proposal.id,
        userId: proposal.proposerId,
        type: EVENT_TYPES.FUNDING_REQUEST_ACCEPTED_INSUFFICIENT_FUNDS
      });
    }
  }

  logger.info(`Proposal finalized with ${proposal.state}`, {
    proposal
  });

  await updateProposal(proposal);

  if (proposal.state === 'passed') {
    await createEvent({
      objectId: proposal.id,
      userId: proposal.proposerId,
      type: proposal.type === 'join'
        ? EVENT_TYPES.REQUEST_TO_JOIN_ACCEPTED
        : EVENT_TYPES.FUNDING_REQUEST_ACCEPTED
    });
  } else if (proposal.state === 'failed') {
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