import { allPermissions } from '../../src/domain/validation/permissions';
import { seeder } from '../seed';

export const seedRoles = async () => {
  // See roles
  await seeder.role.upsert({
    where: {
      name: 'admin'
    },

    create: {
      name: 'admin',
      displayName: 'Admin',
      description: 'The ultimate roles with all permissions',
      permissions: allPermissions as any
    },

    update: {
      permissions: allPermissions as any
    }
  });
};