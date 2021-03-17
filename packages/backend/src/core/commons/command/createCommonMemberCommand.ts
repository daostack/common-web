import * as z from 'zod';
import { CommonMember } from '@prisma/client';
import { prisma } from '@toolkits';
import { CommonError } from '@errors';

const schema = z.object({
  userId: z.string(),
  commonId: z.string()
});

export const createCommonMemberCommand = async (command: z.infer<typeof schema>): Promise<CommonMember> => {
  // Validate the command
  schema.parse(command);

  // Find the common
  const common = await prisma.common.findUnique({
    where: { id: command.commonId },
    include: {
      members: true
    }
  });

  // Check the members
  if (common.members.some((m) => m.userId === command.userId)) {
    throw new CommonError('Cannot add member twice for the same common!');
  }

  // If all checks are fine add the new user as member
  const createdMember = await prisma.commonMember.create({
    data: {
      commonId: command.commonId,
      userId: command.userId
    }
  });

  // @todo Create event for the new member
  // Return the created member
  return createdMember;
};