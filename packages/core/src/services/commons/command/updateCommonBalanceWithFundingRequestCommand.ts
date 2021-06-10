import { prisma } from '@toolkits';
import { NotFoundError } from '@errors';
import { eventService } from '@services';


type Result = 'Updated' | 'InsufficientFunding';

/**
 * Updates the common balance with the amount requested in the accepted funding request
 *
 * @param proposalId - The ID of the accepted proposal that is funding request
 *
 * @returns - Whether the common balance was update, or whether the funding was not sufficient
 */
export const updateCommonBalanceWithFundingRequestCommand = async (proposalId: string): Promise<Result> => {
  // Get the proposals
  const { common, funding, ...proposal } = await prisma.proposal
    .findUnique({
      where: {
        id: proposalId
      },
      include: {
        funding: true,
        common: true
      }
    }) || {};

  // Check if everything is found
  if (!common || !funding || !proposal) {
    throw new NotFoundError('updateCommonBalanceWithFunding.(common,funding,proposal).proposalId', proposalId);
  }

  // Check if the common has enough funding money
  if (common.balance < funding.amount) {
    return 'InsufficientFunding';
  }

  // If the funding was enough update the common balance
  await prisma.common
    .update({
      where: {
        id: common.id
      },
      data: {
        balance: {
          decrement: funding.amount
        },
        blocked: {
          increment: funding.amount
        }
      }
    });

  // Broadcast event
  eventService.create({
    type: 'CommonBalanceUpdated',
    commonId: common.id
  });

  return 'Updated';
};