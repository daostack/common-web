import * as z from 'zod';
import { DiscussionMessage, DiscussionMessageType, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { CommonError } from '@errors';
import { eventService } from '@services';

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
  const member = await prisma.commonMember.findFirst({
    where: {
      userId: payload.userId,
      common: {
        discussions: {
          some: {
            id: payload.discussionId
          }
        }
      }
    },
    select: {
      commonId: true,
      userId: true
    }
  });

  if (!member) {
    throw new CommonError(
      'Cannot create discussion message in discussion that is' +
      'in common that you are not member of'
    );
  }

  // Create the message
  const message = await prisma.discussionMessage.create({
    data: {
      discussionId: payload.discussionId,
      userId: payload.userId,

      message: payload.message,
      type: payload.messageType || DiscussionMessageType.Message
    }
  });

  // Create event about the message @todo Types
  eventService.create({
    type: EventType.DiscussionMessageCreated,
    userId: member.userId,
    commonId: member.commonId,
    payload: {
      messageId: message.id
    }
  });

  // Return the created message
  return message;
};