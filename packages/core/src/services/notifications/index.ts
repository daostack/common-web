import { createNotificationCommand } from './command/createNotificationCommand';
import { processNotificationCommand } from './command/processNotificationCommand';

import { createNotificationTemplateCommand } from './command/createNotificationTemplateCommand';

export const notificationService = {
  create: createNotificationCommand,
  process: processNotificationCommand,

  template: {
    create: createNotificationTemplateCommand
  }
};