import * as z from 'zod';
import { JoinProposal, ProposalState } from '@prisma/client';

import { ProposalLinkSchema } from '@validation';
import { prisma } from '@toolkits';
import { CommonError } from '@errors';

const schema = z.object({
  title: z.string()
    .optional(),

  description: z.string()
    .optional(),

  links: z.array(ProposalLinkSchema),

  fundingAmount: z.number()
    .min(0),

  cardId: z.string()
    .nonempty(),

  commonId: z.string()
    .nonempty(),

  userId: z.string()
    .nonempty()
});

export const createJoinProposalCommand = async (command: z.infer<typeof schema>): Promise<JoinProposal> => {
  // Validate the payload
  schema.parse(command);

  // @todo Validate that the user is the owner of the card

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

      joinProposals: {
        where: {
          userId: command.userId,
          state: ProposalState.Countdown
        }
      }
    }
  });

  // Check if there are other pending join requests in the common for that user
  if (common.joinProposals.length) {
    // If there are proposals at all this should mean that there are for the user
    // and bending, but a little check never hurt no one
    if (common.joinProposals.some(p => p.userId === command.userId && p.state === ProposalState.Countdown)) {
      throw new CommonError('Cannot create new join proposal when there is one that is pending');
    }
  }

  // Check if the user is already a member
  if (common.members.length) {
    if (common.members.some(m => m.userId === command.userId)) {
      throw new CommonError('Cannot create join request for common, that you are a part of');
    }
  }

  // If this checks are successful create the proposal
  const proposal = await prisma.joinProposal.create({
    data: {
      description: {
        create: {
          title: command.title,
          description: command.description,
          link: command.links
        }
      },

      commonId: command.commonId,
      userId: command.userId
    }
  })

};

