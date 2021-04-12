import * as z from 'zod';
import { Discussion, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { eventService } from '@services';

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

  // Create the discussion
  const discussion = await prisma.discussion.create({
    data: {
      userId: payload.userId,
      commonId: payload.commonId,

      topic: payload.topic.trim(),
      description: payload.description.trim()
    }
  });

  // Create event about the discussion creation
  await eventService.create({
    type: EventType.DiscussionCreated,
    commonId: payload.commonId,
    userId: payload.userId,
    payload: {
      discussionId: discussion.id
    }
  });

  // @todo Subscribe the creator to the discussion

  // Return the created discussion
  return discussion;
};