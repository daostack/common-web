import * as z from 'zod';
import { Role, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '@services';

const schema = z.object({
  id: z.string()
    .nonempty(),

  name: z.string()
    .nonempty()
    .optional(),

  displayName: z.string()
    .nonempty()
    .optional(),

  description: z.string()
    .nonempty()
    .optional()
});

export const editRoleCommand = async (payload: z.infer<typeof schema>): Promise<Role> => {
  // Validate the schema
  schema.parse(payload);

  const { id, ...updateData } = payload;

  // Update the role
  const role = await prisma.role
    .update({
      where: {
        id
      },
      data: updateData
    });

  // Broadcast an event
  eventService.create({
    type: EventType.RoleUpdated,
    payload: {
      roleId: id,
      updateData
    }
  });

  // Return the updated role
  return role;
};