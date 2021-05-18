// @ts-ignore
import fs from 'fs';
// @ts-ignore
import path from 'path';

import { PrismaClient, StatisticType } from '@prisma/client';

import { seedNotificationSystemSetting } from './seed/notificationSystemSettings';
import { seedNotificationTemplated } from './seed/notificationTemplates';
import { importUsers } from './firestore/importers/importUsers';
import { importCommons } from './firestore/importers/importCommons';
import { importFundingProposals } from './firestore/importers/importFundingProposals';
import { seedRoles } from './seed/roles';
import { importJoinProposals } from './firestore/importers/importJoinProposals';
import { importCards } from './firestore/importers/importCards';
import { importPayments } from './firestore/importers/paymentImporter';

export const seeder = new PrismaClient();

async function main() {
  // Seed Notification Settings
  await seedNotificationSystemSetting();
  await seedNotificationTemplated();

  // Import firestore
  await importUsers();
  await importCommons();
  await importFundingProposals();

  const date = new Date();
  const dir = path.join(__dirname, `result/${+date}`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }


  await importCards(date);
  await importJoinProposals(date);

  // Import payments
  await importPayments(date);

  // Seed roles and permissions
  await seedRoles();

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
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('🌱  Your database has been seeded.');

    await seeder.$disconnect();

    process.exit(0);
  });
