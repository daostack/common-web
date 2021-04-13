import * as z from 'zod';
import { DiscussionSubscription, DiscussionSubscriptionType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '@services';

const schema = z.object({
  id: z.string()
    .nonempty()
    .uuid(),

  type: z.enum(Object.keys(DiscussionSubscriptionType) as [(keyof typeof DiscussionSubscriptionType)])
});

/**
 * Updates the type of the subscription in the backing store. Please note
 * that this function does not check if the user has permission to update
 * the specified subscription
 *
 * @param payload - The update payload
 *
 * @returns The updated subscription
 */
export const changeDiscussionSubscriptionTypeCommand = async (payload: z.infer<typeof schema>): Promise<DiscussionSubscription> => {
  // Validate the payload
  schema.parse(payload);

  // Update the subscription
  const updatedSubscription = await prisma.discussionSubscription
    .update({
      data: {
        type: payload.type
      },

      where: {
        id: payload.id
      }
    });

  // Crete event
  await eventService.create({
    type: 'DiscussionSubscriptionTypeChanged',
    userId: updatedSubscription.userId,
    payload: {
      discussionId: updatedSubscription.discussionId,
      updatedType: updatedSubscription.type
    }
  });

  // Return the updated subscription
  return updatedSubscription;
};