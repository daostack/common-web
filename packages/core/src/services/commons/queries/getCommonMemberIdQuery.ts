import { prisma } from '../../../domain/toolkits/index';
import { NotFoundError } from '../../../domain/errors/index';

/**
 * Find the member ID of the user on this specific common
 *
 * @param userId - The ID of the user
 * @param commonId - The ID of the common
 */
export const getCommonMemberIdQuery = async (userId: string, commonId: string): Promise<string> => {
  const member = await prisma.commonMember.findUnique({
    where: {
      userId_commonId: {
        userId,
        commonId
      }
    },
    select: {
      id: true
    }
  });

  if (!member) {
    throw new NotFoundError('CommonMember.userId_commonId', JSON.stringify({
      userId,
      commonId
    }));
  }

  return member.id;
};