import { FundingType, ProposalState, Subscription } from '@prisma/client';
import { prisma } from '@toolkits';
import { logger as $logger } from '@logger';
import { NotFoundError, CommonError } from '@errors';

/**
 * Creates new subscription and the initial charge for it
 *
 * @param proposalId - The ID of the proposal that we are creating subscription for.
 *    It MUST not have subscription already created for it
 */
export const createSubscriptionCommand = async (proposalId: string): Promise<Subscription> => {
  const logger = $logger.child({
    functionName: 'createSubscriptionCommand',
    params: {
      proposalId
    }
  });

  // Get the proposal
  const proposal = await prisma.proposal.findUnique({
    where: {
      id: proposalId
    },
    include: {
      join: true
    }
  });

  if (!proposal || !proposal.join) {
    throw new NotFoundError('join.proposalId', proposalId);
  }

  // Check if it is for subscription common
  if (proposal.join.fundingType !== FundingType.Monthly) {
    throw new CommonError('Cannot create subscription for proposal that is not of Monthly funding type', {
      proposal
    });
  }

  // Check the status of it
  if (proposal.state !== ProposalState.Accepted) {
    throw new CommonError('Cannot create subscription for proposal that is not approved');
  }

  // Check if it already has subscription
  if (await prisma.subscription.count({
    where: {
      join: {
        id: proposal.join.id
      }
    }
  })) {
    throw new CommonError('Cannot create subscription because there is already one created for this proposal');
  }

  // Create the subscription
  const subscription = await prisma.subscription.create({
    data: {
      dueDate: new Date(),

      amount: proposal.join.funding,

      userId: proposal.userId,
      cardId: proposal.join.cardId,
      commonId: proposal.commonId,

      join: {
        connect: {
          id: proposal.join.id
        }
      }
    }
  });

  logger.info('Successfully created subscription', {
    subscription
  });

  // @todo Schedule the initial payment

  return subscription;
};