import * as z from 'zod';
import { EventType, FundingProposal, ProposalState } from '@prisma/client';

import { ProposalLinkSchema, ProposalImageSchema, ProposalFileSchema } from '@validation';
import { NotFoundError, CommonError } from '@errors';
import { prisma } from '@toolkits';
import { eventsService } from '@services';

const schema = z.object({
  commonId: z.string()
    .uuid()
    .nonempty(),

  proposerId: z.string()
    .nonempty(),

  title: z.string()
    .nonempty(),

  description: z.string()
    .nonempty(),

  amount: z.number()
    .nonnegative(),

  links: z.array(ProposalLinkSchema)
    .optional()
    .nullable(),

  images: z.array(ProposalImageSchema)
    .optional()
    .nullable(),

  files: z.array(ProposalFileSchema)
    .optional()
    .nullable()
});

export const createFundingProposalCommand = async (command: z.infer<typeof schema>): Promise<FundingProposal> => {
  // Validate the command
  schema.parse(command);

  // Fetch the needed data
  const common = await prisma.common.findUnique({
    where: {
      id: command.commonId
    },
    select: {
      balance: true,
      members: {
        where: {
          userId: command.proposerId
        },
        select: {
          id: true
        }
      }
    }
  });

  // Check if the common is found
  if (common === null) {
    throw new NotFoundError('common', command.commonId);
  }

  // Check if the user is part of the common
  if (common.members.length === 0) {
    throw new CommonError('Non member tried to create a funding proposal', {
      userMessage: 'You can only create funding request in commons that you are member of.',

      commonId: command.commonId,
      userId: command.proposerId,

      command
    });
  }

  // Check the requested amount against the current balance of the common
  if (common.balance < command.amount) {
    throw new CommonError('Not enough balance for funding proposal', {
      userMessage: `You cannot request more funds than there are currently available.`,

      command,
      common
    });
  }

  // Create the funding request
  const fundingRequest = await prisma.fundingProposal.create({
    data: {
      amount: command.amount,

      state: ProposalState.Countdown,

      userId: command.proposerId,
      commonId: command.commonId,
      commonMemberId: common.members[0].id,

      description: {
        create: {
          title: command.title,
          description: command.description,

          link: command.links,
          files: command.files,
          images: command.images
        }
      }
    }
  });

  // Create event
  await eventsService.create({
    userId: command.proposerId,
    commonId: command.commonId,
    type: EventType.FundingRequestCreated
  });

  // Return the created funding proposal
  return fundingRequest;
};