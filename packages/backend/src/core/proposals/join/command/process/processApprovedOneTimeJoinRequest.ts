import { prisma } from '@toolkits';
import { EventType, FundingType, ProposalState } from '@prisma/client';
import { CommonError } from '@errors';
import { paymentService, commonService, eventsService } from '@services';

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
  await eventsService.create({
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

  // Create payment for the join request
  const payment = await paymentService.createOneTimePayment(proposal.id);

  // Finalize the payment
  const paymentUpdate = await paymentService.finalizePayment(payment.id);

  // If the payment was successful add the user as member
  if (paymentUpdate.paymentSuccessful) {
    await commonService.createMember({
      commonId: proposal.commonId,
      userId: proposal.userId
    });
  }
};