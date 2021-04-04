import { prisma } from '@toolkits';
import { eventsService } from '../../../../index';
import { ProposalState, EventType } from '@prisma/client';

export const processRejectedJoinRequest = async (proposalId: string): Promise<void> => {
  // Change the proposal state
  const proposal = await prisma.proposal.update({
    where: {
      id: proposalId
    },
    data: {
      state: ProposalState.Rejected
    }
  });

  // Create event
  await eventsService.create({
    type: EventType.JoinRequestRejected,
    userId: proposal.userId,
    commonId: proposal.commonId,
    payload: JSON.stringify(proposal)
  });
};