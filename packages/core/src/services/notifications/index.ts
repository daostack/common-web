import { createNotificationCommand } from './command/createNotificationCommand';
import { processNotificationCommand } from './command/processNotificationCommand';

import { createNotificationTemplateCommand } from './command/createNotificationTemplateCommand';
import { createNotificationEventSettings } from './command/createNotificationEventSettings';

import { updateNotificationSettings } from './command/updateNotificationSettings';
import { updateNotificationTemplate } from './command/updateNotificationTemplate';
import { deleteNotificationEventSettingsCommand } from './command/deleteNotificationEventSettingsCommand';

export const notificationService = {
  create: createNotificationCommand,
  process: processNotificationCommand,

  template: {
    create: createNotificationTemplateCommand,
    update: updateNotificationTemplate
  },

  settings: {
    createEventSettings: createNotificationEventSettings,
    deleteEventSettings: deleteNotificationEventSettingsCommand,
    update: updateNotificationSettings
  }
};