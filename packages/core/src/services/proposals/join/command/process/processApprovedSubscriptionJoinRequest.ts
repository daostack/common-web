import { ProposalState, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '../../../../index';

import { createSubscriptionCommand } from '../../../../subscriptions/command/createSubscriptionCommand';


/**
 * Process proposal that is approved and made in subscription common
 *
 * @param proposalId - The ID of the approved proposal
 */
export const processApprovedSubscriptionJoinRequest = async (proposalId: string): Promise<void> => {
  const proposal = await prisma.proposal.update({
    where: {
      id: proposalId
    },
    data: {
      state: ProposalState.Accepted
    },
    include: {
      join: true
    }
  });

  // Create event
  eventService.create({
    type: EventType.JoinRequestAccepted,
    userId: proposal.userId,
    commonId: proposal.commonId,
    payload: JSON.stringify({
      proposal
    })
  });

  await createSubscriptionCommand(proposalId);
};