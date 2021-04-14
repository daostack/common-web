import { createNotificationCommand } from './command/createNotificationCommand';
import { processNotificationCommand } from './command/processNotificationCommand';

export const notificationService = {
  create: createNotificationCommand,
  process: processNotificationCommand
};