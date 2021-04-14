import { Notification } from '@prisma/client';
import { NotImplementedError } from '@errors';

export const sendPushNotification = async (notification: Notification): Promise<void> => {
  throw new NotImplementedError();
};