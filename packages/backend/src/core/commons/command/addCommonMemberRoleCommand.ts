import * as z from 'zod';
import { CommonMemberRole, CommonMember } from '@prisma/client';
import { prisma } from '@toolkits';

const schema = z.object({
  memberId: z.string()
    .nonempty(),

  roles: z.array(z.enum(
    Object.keys(CommonMemberRole) as [(keyof typeof CommonMemberRole)]
  ))
});

export const addCommonMemberRoleCommand = async (command: z.infer<typeof schema>): Promise<CommonMember> => {
  // Validate the command
  schema.parse(command);

  // Find the member entity (we need to fetch the entity first to ensure that the user does not have this role already)
  const memberEntity = await prisma.commonMember.findUnique({ where: { id: command.memberId } });

  // Add the roles (if unique)
  const updatedMemberEntity = prisma.commonMember.update({
    where: {
      id: command.memberId
    },
    data: {
      roles: Array.from(
        new Set([
          ...memberEntity.roles,
          ...command.roles
        ])
      )
    }
  });

  // @todo Create event

  // Return the updated entity
  return updatedMemberEntity;
};