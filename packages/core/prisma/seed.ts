import { PrismaClient } from '@prisma/client';

import { importUsers } from './firestore/importers/importUsers';
import { importCommons } from './firestore/importers/importCommons';
import { importFundingProposals } from './firestore/importers/importFundingProposals';

export const seeder = new PrismaClient();

async function main() {
  // Seed Notification Settings
  // await seedNotificationSystemSetting();
  // await seedNotificationTemplated();

  // Import firestore
  await importUsers();
  await importCommons();
  await importFundingProposals();

  // See roles
  await seeder.role.upsert({
    where: {
      name: 'admin'
    },

    create: {
      name: 'admin',
      displayName: 'Admin',
      description: 'The ultimate role with all permissions'
    },

    update: {
      permissions: [
        'admin.report.read',
        'admin.report.act',

        'admin.roles.read',
        'admin.roles.create',
        'admin.roles.update',

        'admin.roles.permissions.add',
        'admin.roles.permissions.remove',

        'admin.roles.assign',
        'admin.roles.unassign',

        'user.permissions.read'
      ]
    }
  });
}

main()
  .then(() => {
    console.log('🌱  Your database has been seeded.');
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seeder.$disconnect();
  });
