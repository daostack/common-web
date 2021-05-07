import { createNotificationCommand } from './command/createNotificationCommand';
import { processNotificationCommand } from './command/processNotificationCommand';

import { createNotificationTemplateCommand } from './command/createNotificationTemplateCommand';
import { createNotificationEventSettings } from './command/createNotificationEventSettings';

export const notificationService = {
  create: createNotificationCommand,
  process: processNotificationCommand,

  template: {
    create: createNotificationTemplateCommand
  },

  settings: {
    createEventSettings: createNotificationEventSettings
  }
};