import { prisma } from '@toolkits';
import { canSeeCommonReports } from './canSeeCommonReports';

export const canSeeMessageReports = async (userId: string, messageId: string): Promise<boolean> => {
  const commonWithId = await prisma.discussionMessage
    .findUnique({
      where: {
        id: messageId
      }
    })
    .discussion()
    .common({
      select: {
        id: true
      }
    });

  return canSeeCommonReports(userId, commonWithId?.id!);
};