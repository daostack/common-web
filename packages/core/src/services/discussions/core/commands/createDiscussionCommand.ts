import * as z from 'zod';
import { Discussion, EventType, DiscussionType } from '@prisma/client';

import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { eventService } from '@services';
import { createDiscussionSubscriptionCommand } from '../../subscriptions/createDiscussionSubscriptionCommand';

const schema = z.object({
  commonId: z.string()
    .uuid(),

  proposalId: z.string()
    .uuid()
    .optional()
    .nullable(),

  userId: z.string()
    .nonempty(),

  topic: z.string()
    .nonempty(),

  description: z.string()
    .nonempty()
});

/**
 * Creates new discussion for a common or proposal. The userId must me of a
 * user that is common member of that common, or the common of that proposal
 *
 * @param payload
 */
export const createDiscussionCommand = async (payload: z.infer<typeof schema>): Promise<Discussion> => {
  // Validate the payload
  schema.parse(payload);

  // Check if the user is common member
  if (
    !(await prisma.commonMember.count({
      where: {
        userId: payload.userId,
        commonId: payload.commonId
      }
    }))
  ) {
    throw new CommonError('Cannot create discussion in a common that you are not member of!');
  }

  // @todo If there is proposal id check if it is from the common

  // Create the discussion
  const discussion = await prisma.discussion.create({
    data: {
      userId: payload.userId,
      commonId: payload.commonId,

      topic: payload.topic.trim(),
      description: payload.description.trim(),

      type: payload.proposalId
        ? DiscussionType.ProposalDiscussion
        : DiscussionType.CommonDiscussion
    }
  });

  // Create event about the discussion creation
  eventService.create({
    type: EventType.DiscussionCreated,
    commonId: payload.commonId,
    userId: payload.userId,
    payload: {
      discussionId: discussion.id
    }
  });

  // Subscribe the creator to the discussion
  await createDiscussionSubscriptionCommand({
    discussionId: discussion.id,
    userId: discussion.userId
  });

  // Return the created discussion
  return discussion;
};