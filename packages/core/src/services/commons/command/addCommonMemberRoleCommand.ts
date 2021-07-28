import * as z from 'zod';
import { CommonMemberRole, CommonMember, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { NotFoundError } from '@errors';
import { eventService } from '@services';

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

  // Find the member entity (we need to fetch the entity first to ensure that the user does not have this roles already)
  const memberEntity = await prisma.commonMember.findUnique({ where: { id: command.memberId } });

  // Check if the common is found
  if (!memberEntity) {
    throw new NotFoundError('MemberEntity', command.memberId);
  }

  // Add the roles (if unique)
  const updatedMemberEntity = await prisma.commonMember.update({
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
  eventService.create({
    type: EventType.CommonMemberRoleAdded,
    commonId: memberEntity.commonId,
    userId: memberEntity.userId,
    payload: {
      memberId: memberEntity.id,
      addedRoles: command.roles,
      rolesBefore: memberEntity.roles,
      rolesAfter: updatedMemberEntity.roles
    }
  });

  // Return the updated entity
  return updatedMemberEntity;
};