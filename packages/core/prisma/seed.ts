import { NotificationType, NotificationTemplateType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Notification Settings

  await prisma.notificationSystemSettings.upsert({
    where: {
      type: NotificationType.FundingRequestAccepted
    },
    update: {},
    create: {
      type: NotificationType.FundingRequestAccepted,

      sendPush: true,
      sendEmail: true,

      showInUserFeed: true
    }
  });

  await prisma.notificationSystemSettings.upsert({
    where: {
      type: NotificationType.FundingRequestRejected
    },
    update: {},
    create: {
      type: NotificationType.FundingRequestRejected,

      sendPush: true,
      sendEmail: true,

      showInUserFeed: true
    }
  });

  // Create templates
  await prisma.notificationTemplate.upsert({
    where: {
      forType_templateType_language: {
        forType: NotificationType.FundingRequestAccepted,
        templateType: NotificationTemplateType.EmailNotification,
        language: 'EN'
      }
    },
    update: {},
    create: {
      forType: NotificationType.FundingRequestAccepted,
      templateType: NotificationTemplateType.EmailNotification,
      language: 'EN',

      subject: 'Good news {{user.firstName}} {{user.lastName}}',
      content: 'Your Proposal {{proposal.title}} for {{proposal.funding.amount}} was accepted',

      stubs: [
        'user.firstName',
        'user.lastName',
        'proposal.title',
        'proposal.funding.amount'
      ]
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
