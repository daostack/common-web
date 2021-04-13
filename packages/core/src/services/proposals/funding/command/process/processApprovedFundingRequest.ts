import { ProposalState, Proposal, FundingState, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { eventService } from '../../../../index';

export const processApprovedFundingRequest = async (proposalArg: Proposal): Promise<void> => {
  if (!proposalArg.fundingId) {
    throw new CommonError('No funding ID available', {
      proposalArg
    });
  }

  // Update the proposal funding availability
  const [
    proposal,
    fundingProposal
  ] = await prisma.$transaction([
    prisma.proposal.update({
      where: {
        id: proposalArg.id
      },
      data: {
        state: ProposalState.Accepted
      }
    }),
    prisma.fundingProposal.update({
      where: {
        id: proposalArg.fundingId
      },
      data: {
        fundingState: FundingState.Eligible
      }
    })
  ]);

  // Create event
  eventService.create({
    type: EventType.FundingRequestAccepted,
    userId: proposal.userId,
    commonId: proposal.commonId,
    payload: JSON.stringify({
      proposal
    })
  });
};