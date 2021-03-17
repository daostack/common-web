import * as z from 'zod';
import { CommonMemberRole, CommonMember, EventType } from '@prisma/client';
import { prisma } from '@toolkits';
import { eventsService } from '@services';

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

  // Create event
  await eventsService.commands.create({
    type: EventType.CommonMemberRoleAdded,
    commonId: memberEntity.commonId,
    userId: memberEntity.userId
  });

  // Return the updated entity
  return updatedMemberEntity;
};