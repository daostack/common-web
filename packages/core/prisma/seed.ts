import { PrismaClient, StatisticType } from '@prisma/client';
import { allPermissions } from '../src/domain/validation/permissions';
import { seedNotificationSystemSetting } from './seed/notificationSystemSettings';
import { seedNotificationTemplated } from './seed/notificationTemplates';
import { importUsers } from './firestore/importers/importUsers';
import { importCommons } from './firestore/importers/importCommons';
import { importFundingProposals } from './firestore/importers/importFundingProposals';

export const seeder = new PrismaClient();

async function main() {
  // Seed Notification Settings
  await seedNotificationSystemSetting();
  await seedNotificationTemplated();

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
      description: 'The ultimate role with all permissions',
      permissions: allPermissions
    },

    update: {
      permissions: allPermissions
    }
  });

  // Create the global statistics
  await seeder.statistic.create({
    data: {
      type: StatisticType.AllTime,

      users: 0,
      commons: 0,
      payments: 0,
      paymentsAmount: 0,
      discussions: 0,
      discussionMessages: 0,
      fundingProposals: 0,
      joinProposals: 0
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
