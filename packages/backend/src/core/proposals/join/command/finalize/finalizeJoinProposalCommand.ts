import { EventType, FundingType, ProposalState, ProposalType } from '@prisma/client';
import { prisma } from '@toolkits';
import { NotFoundError, CommonError } from '@errors';
import { getProposalVoteCountQuery } from '@votes/queries/getProposalVoteCountQuery';
import { eventsService } from '@services';
import { finalizeApprovedOneTimeJoinRequestCommand } from './finalizeApprovedOneTimeJoinRequestCommand';

export const finalizeJoinProposalCommand = async (proposalId: string): Promise<void> => {
  // Find the proposal and the join
  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId
    },
    include: {
      join: true,
      common: {
        select: {
          fundingType: true
        }
      }
    }
  });

  // Check if the proposal exists. As this should not be user
  // accessible the proposal should be always found
  if (!proposal) {
    throw new NotFoundError('proposal', proposalId);
  }

  // Check the type of the proposal
  if (proposal.type !== ProposalType.JoinRequest) {
    throw new CommonError('Cannot finalize non join proposal in `finalizeJoinProposalCommand`', {
      proposal
    });
  }

  // Check the state of the proposal
  if (proposal.state !== ProposalState.Finalizing) {
    throw new CommonError('Cannot finalize that is not in finalizing state', {
      proposal
    });
  }

  // Count the votes
  const votesCount = await getProposalVoteCountQuery(proposalId);

  // If the proposal has been approved
  if (votesCount.votesFor > votesCount.votesAgainst) {
    if (proposal.common.fundingType === FundingType.OneTime) {
      await finalizeApprovedOneTimeJoinRequestCommand(proposal.id);
    } else if (proposal.common.fundingType === FundingType.Monthly) {
      // @todo Handle approved monthly common
    } else {
      throw new CommonError('Unsupported common funding type occurred');
    }

  }
  // If the proposal has been rejected
  else if (votesCount.votesAgainst > votesCount.votesFor) {
    // Change the proposal state
    await prisma.proposal.update({
      where: {
        id: proposalId
      },
      data: {
        state: ProposalState.Rejected
      }
    });

    // Create event @todo Add the proposal ID to the payload
    await eventsService.create({
      type: EventType.JoinRequestRejected,
      userId: proposal.userId,
      commonId: proposal.commonId
    });
  }
};