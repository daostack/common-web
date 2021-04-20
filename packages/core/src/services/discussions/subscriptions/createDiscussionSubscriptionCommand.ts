import * as z from 'zod';
import { DiscussionSubscription, DiscussionSubscriptionType, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '@services';

const schema = z.object({
  discussionId: z.string()
    .uuid()
    .nonempty(),

  userId: z.string()
    .nonempty(),

  subscriptionType: z.enum(Object.keys(DiscussionSubscriptionType) as [(keyof typeof DiscussionSubscriptionType)])
    .nullable()
    .optional()
});

export const createDiscussionSubscriptionCommand = async (payload: z.infer<typeof schema>): Promise<DiscussionSubscription> => {
  // Validate the payload
  schema.parse(payload);

  // Create the subscription
  const subscription = await prisma.discussionSubscription.create({
    data: {
      discussionId: payload.discussionId,
      userId: payload.userId,

      type: payload.subscriptionType || DiscussionSubscriptionType.AllNotifications
    },
    include: {
      discussion: {
        select: {
          commonId: true
        }
      }
    }
  });


  // Create event
  eventService.create({
    type: EventType.DiscussionSubscriptionCreated,
    userId: payload.userId,
    commonId: subscription.discussion.commonId,
    payload: {
      discussionId: payload.discussionId,
      discussionSubscriptionId: subscription.id
    }
  });

  // Return the created subscription
  return subscription;
};