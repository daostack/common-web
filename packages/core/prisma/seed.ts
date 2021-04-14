import { NotificationType, NotificationTemplateType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Notification Settings

  await prisma.notificationSystemSettings.upsert({
    where: {
      type: NotificationType.RequestToJoinAccepted
    },
    update: {},
    create: {
      type: NotificationType.RequestToJoinAccepted,

      sendPush: true,
      sendEmail: true,

      showInUserFeed: true
    }
  });

  await prisma.notificationSystemSettings.upsert({
    where: {
      type: NotificationType.RequestToJoinRejected
    },
    update: {},
    create: {
      type: NotificationType.RequestToJoinRejected,

      sendPush: true,
      sendEmail: true,

      showInUserFeed: true
    }
  });

  // Create templates
  await prisma.notificationTemplate.upsert({
    where: {
      forType_templateType_language: {
        forType: NotificationType.RequestToJoinAccepted,
        templateType: NotificationTemplateType.EmailNotification,
        language: 'EN'
      }
    },
    update: {},
    create: {
      forType: NotificationType.RequestToJoinAccepted,
      templateType: NotificationTemplateType.EmailNotification,
      language: 'EN',

      subject: 'Good news {{user.firstName}} {{user.lastName}}',
      content: '',

      stubs: [
        'user.firstName',
        'user.lastName'
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
