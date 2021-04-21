import { CommonMemberRole } from '@prisma/client';
import { prisma } from '@toolkits';

export const canSeeCommonReports = async (userId: string, commonId: string): Promise<boolean> => {
  // The user can if they are common moderator
  const membership = await prisma.commonMember.findFirst({
    where: {
      userId,
      commonId
    }
  });

  if (membership && membership.roles.includes(CommonMemberRole.Moderator)) {
    return true;
  }

  // @todo The user can if they are system admin

  // The user cannot in all other situations
  return false;
};