import { prisma } from '@toolkits';

export const canChangeDiscussionSubscription = async (discussionSubscriptionId: string, userId: string): Promise<boolean> => {
  const discussionSubscription = await prisma.discussionSubscription
    .findUnique({
      where: {
        id: discussionSubscriptionId
      },
      select: {
        userId: true
      }
    });

  return discussionSubscription?.userId === userId;
};