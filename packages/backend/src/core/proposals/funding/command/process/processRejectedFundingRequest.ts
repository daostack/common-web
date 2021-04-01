import { Proposal, ProposalState, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventsService } from '@services';

export const processRejectedFundingRequest = async (proposal: Proposal): Promise<void> => {
  // Change the proposal state
  await prisma.proposal.update({
    where: {
      id: proposal.id
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
};