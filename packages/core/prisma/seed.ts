import { NotificationType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Notification Settings

  await prisma.notificationSystemSettings.create({
    data: {
      type: NotificationType.RequestToJoinAccepted,

      sendPush: true,
      sendEmail: true,

      showInUserFeed: true
    }
  });

  await prisma.notificationSystemSettings.create({
    data: {
      type: NotificationType.RequestToJoinRejected,

      sendPush: true,
      sendEmail: true,

      showInUserFeed: true
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
