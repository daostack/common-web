import { prisma } from '../../../../../domain/toolkits/index';
import { EventType, FundingType, ProposalState } from '@prisma/client';
import { CommonError } from '../../../../../domain/errors/index';
import { paymentService, commonService, eventService } from '../../../../index';

export const processApprovedOneTimeJoinRequestCommand = async (proposalId: string) => {
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
  await eventService.create({
    type: EventType.JoinRequestAccepted,
    userId: proposal.userId,
    commonId: proposal.commonId,
    payload: JSON.stringify({
      proposal
    })
  });

  if (!proposal.join) {
    throw new CommonError('Cannot process non join request proposal');
  }

  if (proposal.state !== ProposalState.Accepted) {
    throw new CommonError('Cannot process not accepted join request');
  }

  if (proposal.join.fundingType !== FundingType.OneTime) {
    throw new CommonError('Cannot process proposal that is not of one time');
  }

  if (proposal.join.funding > 0) {
    // Create payment
    await paymentService.createOneTimePayment(proposal.id);
  } else {
    // Add the common member
    await commonService.createMember({
      commonId: proposal.commonId,
      userId: proposal.userId
    });
  }
};