import { prisma } from '@toolkits';
import { userCan } from '../userCan';

export const canUpdateCommon = async (commonId: string, userId: string): Promise<boolean> => {
  const membership = (await prisma.common
    .findUnique({
      where: {
        id: commonId
      }
    })
    .members({
      where: {
        userId: userId
      }
    }))[0];


  return (
    membership?.roles?.includes('Founder') ||
    membership?.roles?.includes('Moderator') ||
    userCan(userId, 'admin.commons.update')
  );
};