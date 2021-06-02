import * as z from 'zod';
import { Role, EventType } from '@prisma/client';

import { prisma } from '@toolkits';
import { eventService } from '@services';
import { PermissionValidator } from '@validation';

const schema = z.object({
  permissions: z.array(PermissionValidator)
    .nonempty(),

  name: z.string()
    .nonempty(),

  displayName: z.string()
    .nonempty(),

  description: z.string()
    .nonempty()
});

export const createRoleCommand = async (payload: z.infer<typeof schema>): Promise<Role> => {
  // Validate the payload
  schema.parse(payload);

  // Create the roles
  const role = await prisma.role.create({
    data: payload
  });

  // Create event
  eventService.create({
    type: EventType.RoleCreated,
    payload: {
      roleId: role.id,
      permissions: role.permissions
    }
  });

  // Return the created roles
  return role;
};