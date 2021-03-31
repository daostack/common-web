import * as z from 'zod';
import { EventType, ProposalState, ProposalType, Proposal } from '@prisma/client';

import { CommonError, NotFoundError } from '@errors';
import { ProposalLinkSchema } from '@validation';
import { eventsService } from '@services';
import { prisma } from '@toolkits';

import { generateProposalExpiresAtDate } from '../../helpers/generateProposalExpiresAtDate';

const schema = z.object({
  title: z.string()
    .optional(),

  description: z.string()
    .optional(),

  ipAddress: z.string()
    .nonempty(),

  links: z.array(ProposalLinkSchema)
    .nullable()
    .optional(),

  fundingAmount: z.number()
    .min(0),

  cardId: z.string()
    .nonempty(),

  commonId: z.string()
    .nonempty(),

  userId: z.string()
    .nonempty()
});

export const createJoinProposalCommand = async (command: z.infer<typeof schema>): Promise<Proposal> => {
  // Validate the payload
  schema.parse(command);

  // Validate that the user is the owner of the card
  // if (!await cardsService.isCardOwner(command.cardId, command.userId)) {
  //   throw new CommonError('Cannot create proposals with cards not created by you');
  // }

  // Fetch the common and related data
  const common = await prisma.common.findUnique({
    where: {
      id: command.commonId
    },
    include: {
      members: {
        where: {
          userId: command.userId
        }
      },

      proposals: {
        where: {
          userId: command.userId,
          type: ProposalType.JoinRequest,
          state: {
            in: [
              ProposalState.Countdown,
              ProposalState.Finalizing
            ]
          }
        }
      }
    }
  });

  // Check if the common is found
  if (!common) {
    throw new NotFoundError('Common', command.commonId);
  }

  // Check if the proposal funding is the same or more than the minimum for the common
  if (common.fundingMinimumAmount > command.fundingAmount) {
    throw new CommonError('Cannot create join request with less than the minimum funding amount required for the common');
  }

  // Check if there are other pending join requests in the common for that user
  if (common.proposals.length) {
    // If there are proposals at all this should mean that there are for the user
    // and bending, but a little check never hurt no one
    if (common.proposals.some(
      p =>
        p.userId === command.userId &&
        (p.state === ProposalState.Countdown || p.state === ProposalState.Finalizing)
    )) {
      throw new CommonError('Cannot create new join proposal when there is one that is pending or currently finalizing', {
        proposals: common.proposals
      });
    }
  }

  // Check if the user is already a member
  if (common.members.length) {
    if (common.members.some(m => m.userId === command.userId)) {
      throw new CommonError('Cannot create join request for common, that you are a part of');
    }
  }

  // If this checks are successful create the proposal
  const proposal = await prisma.proposal.create({
    data: {
      type: ProposalType.JoinRequest,

      link: command.links,
      title: command.title,
      description: command.description,

      expiresAt: generateProposalExpiresAtDate(ProposalType.JoinRequest),

      user: {
        connect: {
          id: command.userId
        }
      },

      common: {
        connect: {
          id: command.commonId
        }
      },

      join: {
        create: {
          fundingType: common.fundingType,
          funding: command.fundingAmount,
          card: {
            connect: {
              id: command.cardId
            }
          }
        }
      }
    }
  });

  // Create event
  await eventsService.create({
    type: EventType.JoinRequestCreated,
    commonId: command.commonId,
    userId: command.userId
  });

  // Return the created proposal
  return proposal;
};

