import { NotificationType } from '@prisma/client';

import { seeder } from '../seed';

const withEmail: NotificationType[] = [
  NotificationType.JoinRequestRejected,
  NotificationType.JoinRequestAccepted,
  NotificationType.FundingRequestAccepted,
  NotificationType.FundingRequestRejected
];

const withPush: NotificationType[] = [];

const withShow: NotificationType[] = [];

export const seedNotificationSystemSetting = async () => {
  const allTypes = Object.keys(NotificationType) as NotificationType[];

  for (const type of allTypes) {
    await seeder.notificationSystemSettings.upsert({
      where: {
        type
      },
      update: {
        showInUserFeed: withShow.includes(type),
        sendEmail: withEmail.includes(type),
        sendPush: withPush.includes(type)
      },
      create: {
        type,

        showInUserFeed: withShow.includes(type),
        sendEmail: withEmail.includes(type),
        sendPush: withPush.includes(type)
      }
    });
  }
};