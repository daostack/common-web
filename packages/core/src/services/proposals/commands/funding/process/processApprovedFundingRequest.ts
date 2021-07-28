import { ProposalState, Proposal, FundingState, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { eventService, commonService } from '@services';

export const processApprovedFundingRequest = async (proposalArg: Proposal): Promise<void> => {
  if (!proposalArg.fundingId) {
    throw new CommonError('No funding ID available', {
      proposalArg
    });
  }

  // Update the common balance
  const updateResult = await commonService.updateBalance.withFundingProposal(proposalArg.id);

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
        state: updateResult === 'Updated'
          ? ProposalState.Accepted
          : ProposalState.AcceptedButInsufficientFunding
      }
    }),
    prisma.fundingProposal.update({
      where: {
        id: proposalArg.fundingId
      },
      data: {
        fundingState: updateResult === 'Updated'
          ? FundingState.Eligible
          : FundingState.NotEligible
      }
    })
  ]);

  // Create event
  eventService.create({
    type: EventType.FundingRequestAccepted,
    userId: proposal.userId,
    proposalId: proposal.id,
    commonId: proposal.commonId,
    payload: JSON.stringify({
      proposalId: proposal.id
    })
  });
};