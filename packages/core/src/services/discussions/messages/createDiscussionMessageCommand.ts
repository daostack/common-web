import * as z from 'zod';
import { DiscussionMessage, DiscussionMessageType } from '@prisma/client';
import { prisma } from '@toolkits';
import { NotImplementedError } from '@errors';

const schema = z.object({
  userId: z.string()
    .nonempty(),

  discussionId: z.string()
    .uuid()
    .nonempty(),

  message: z.string()
    .nonempty(),

  messageType: z.enum(Object.keys(DiscussionMessageType) as [(keyof typeof DiscussionMessageType)])
    .optional()
});

export const createDiscussionMessageCommand = async (payload: z.infer<typeof schema>): Promise<DiscussionMessage> => {
  // Validate the payload
  schema.parse(payload);

  // Check if the user can create messages in that discussion
  const isMember = !!(
    await prisma.commonMember.count({
      where: {
        userId: payload.userId,
        common: {
          discussions: {
            some: {
              id: payload.discussionId
            }
          }
        }
      }
    })
  );


  // Create the message

  // Create event about the message

  // Return the created message
  throw new NotImplementedError();
};