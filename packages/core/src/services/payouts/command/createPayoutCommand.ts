import * as z from 'zod';
import { FundingState, Payout, EventType } from '@prisma/client';
import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { logger } from '@logger';
import { eventService } from '@services';

const schema = z.object({
  proposalIds: z.array(z.string()),
  wireId: z.string(),

  description: z.string()
    .optional()
    .nullable()
});

export const createPayoutCommand = async (command: z.infer<typeof schema>): Promise<Payout> => {
  // Validate the schema
  schema.parse(command);

  logger.info('Beginning creation payout for valid payload');

  // Find all the proposals and the wire
  const proposals = await prisma.proposal
    .findMany({
      where: {
        id: {
          in: command.proposalIds
        }
      },
      include: {
        funding: true
      }
    });

  const wire = await prisma.wire
    .findUnique({
      where: {
        id: command.wireId
      }
    });

  // Check if all proposals are found
  if (proposals.length !== command.proposalIds.length) {
    throw new CommonError(
      `Cannot create payout because not all proposals were found. ` +
      `Found ${proposals.length}, Expected: ${command.proposalIds.length}`
    );
  }

  // Check if all proposals are eligible for payout
  if (proposals.some(x => x.funding?.fundingState !== FundingState.Eligible)) {
    throw new CommonError('Cannot create payout for proposal that are not funding eligible!', {
      proposals
    });
  }

  // Check if the wire exists
  if (!wire) {
    throw new CommonError('Cannot create payout because the selected wire was not found');
  }

  // Calculate the requirement for each common
  const commonRequirements: any = {};

  for (const p of proposals) {
    commonRequirements[p.commonId] = (commonRequirements[p.commonId] || 0) + (p.funding!).amount;
  }

  // Fetch the commons and check
  const commons = await prisma.common
    .findMany({
      where: {
        id: {
          in: Object.keys(commonRequirements)
        }
      }
    });

  for (const common of commons) {
    if (common.blocked < commonRequirements[common.id]) {
      throw new CommonError('Cannot create the payout because common does not have enough blocked funds!');
    }
  }

  // Calculate the required amount
  const amount = (proposals.map(p => (p.funding!).amount))
    .reduce((p, a) => {
      return a + p;
    }, 0);

  // Find the IDs of the users involved
  const userIds = Array.from(
    new Set(proposals.map(p => p.userId))
  );

  if (userIds.length > 1) {
    logger.warn('One payout serving more than one user is being created!');
  }

  // Mark all the proposals as «Redeemed»
  const fp = await prisma.fundingProposal
    .updateMany({
      data: {
        fundingState: FundingState.Redeemed
      },
      where: {
        proposal: {
          id: {
            in: command.proposalIds
          }
        }
      }
    });

  logger.info('Proposals marked successfully as redeemed');

  // Claim the common funds
  Object.keys(commonRequirements).map(async (commonId) => {
    logger.info(`Claiming ${commonRequirements[commonId]} cents from common with id ${commonId}`);

    await prisma.common.update({
      where: {
        id: commonId
      },
      data: {
        blocked: {
          decrement: commonRequirements[commonId]
        }
      }
    });

    logger.info(`Claimed ${commonRequirements[commonId]} cents from common with id ${commonId}`);
  });

  // Create the payout in the database
  const payout = await prisma.payout
    .create({
      data: {
        amount,

        description: command.description || `Payout for $${amount / 100}`,


        proposals: {
          connect: command.proposalIds
            .map((pid) => ({
                id: pid
              })
            )
        },

        wire: {
          connect: {
            id: command.wireId
          }
        },

        users: {
          connect: userIds.map(uid => ({
            id: uid
          }))
        }
      }
    });

  logger.info(`Payout (${payout.id}) successfully created`);

  // Find all users, able to approve the proposal
  const userWithApproverPermission = await prisma.user
    .findMany({
      where: {
        permissions: {
          hasSome: 'admin.financials.payouts.approve'
        }
      },
      select: {
        id: true
      }
    });

  logger.info(`Creating proposal approvers for ${userWithApproverPermission.length} users`);

  // Create the approvers
  await prisma.payoutApprover
    .createMany({
      data: userWithApproverPermission.map((user) => ({
        userId: user.id,
        payoutId: payout.id
      }))
    });

  for (const approver of userWithApproverPermission) {
    eventService.create({
      type: EventType.PayoutApproverCreated,
      userId: approver.id,
      payload: {
        payoutId: payout.id
      }
    });
  }

  logger.info(`Created proposal approvers for ${userWithApproverPermission.length} users`);


  // Create event
  eventService.create({
    type: EventType.PayoutCreated,
    payoutId: payout.id,
    payload: {
      proposalIds: command.proposalIds,
      payoutId: payout.id,
      userIds: userIds
    }
  });


  // Return the created payout
  return payout;
};