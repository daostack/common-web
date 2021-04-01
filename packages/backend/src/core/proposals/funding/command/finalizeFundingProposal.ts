import { ProposalState, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { NotFoundError, CommonError } from '@errors';
import { eventsService, votesService } from '@services';
import { processApprovedFundingRequest } from './process/processApprovedFundingRequest';

export const finalizeFundingProposal = async (proposalId: string): Promise<void> => {
  // Find the proposal
  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId
    },
    include: {
      funding: true
    }
  });

  // Check if the proposal exists. As this should not be user
  // accessible the proposal should be always found
  if (!proposal) {
    throw new NotFoundError('proposal', proposalId);
  }

  // Validate the conditions

  // Check if the proposal is funding proposal
  if (!proposal.funding) {
    throw new CommonError('Cannot finalize non funding proposal');
  }

  // Check the state of the proposal
  if (proposal.state !== ProposalState.Finalizing) {
    throw new CommonError('Cannot finalize that is not in finalizing state', {
      proposal
    });
  }

  // Count the vote
  const votesCount = await votesService.getVotesCount(proposalId);


  // Process according to the votes outcome
  if (votesCount.votesFor > votesCount.votesAgainst) {
    // @todo Process approved funding request
    await processApprovedFundingRequest(proposal);
  }

  // If the proposal has been rejected
  else if (votesCount.votesAgainst >= votesCount.votesFor) {
    // Change the proposal state
    await prisma.proposal.update({
      where: {
        id: proposalId
      },
      data: {
        state: ProposalState.Rejected
      }
    });

    // Create event
    await eventsService.create({
      type: EventType.FundingRequestRejected,
      userId: proposal.userId,
      commonId: proposal.commonId,
      payload: JSON.stringify(proposal)
    });
  }
};