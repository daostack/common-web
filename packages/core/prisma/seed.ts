import { PrismaClient } from '@prisma/client';
import { seedNotificationSystemSetting } from './seed/notificationSystemSettings';
import { seedNotificationTemplated } from './seed/notificationTemplates';

export const seeder = new PrismaClient();

async function main() {
  // Seed Notification Settings
  await seedNotificationSystemSetting();
  await seedNotificationTemplated();

  // Create templates
  // await seeder.notificationTemplate.upsert({
  //   where: {
  //     forType_templateType_language: {
  //       forType: NotificationType.FundingRequestAccepted,
  //       templateType: NotificationTemplateType.EmailNotification,
  //       language: 'EN'
  //     }
  //   },
  //   update: {},
  //   create: {
  //     forType: NotificationType.FundingRequestAccepted,
  //     templateType: NotificationTemplateType.EmailNotification,
  //     language: 'EN',
  //
  //     subject: 'Good news {{user.firstName}} {{user.lastName}}',
  //     content: 'Your Proposal {{proposal.title}} for {{proposal.funding.amount}} was accepted',
  //
  //     stubs: [
  //       'user.firstName',
  //       'user.lastName',
  //       'proposal.title',
  //       'proposal.funding.amount'
  //     ]
  //   }
  // });
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
