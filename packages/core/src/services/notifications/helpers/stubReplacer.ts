import { get } from 'lodash';
import { NotificationTemplate } from '@prisma/client';

import { logger } from '@logger';
import { stringUtils } from '@utils';

export interface ISendableNotification {
  subject: string;
  content: string;
}

const globalStubs = {
  supportChatLink: 'https://common.io/help'
};

export const stubReplacer = (templatingData: any, template: NotificationTemplate): ISendableNotification => {
  let { subject, content, stubs } = template;

  templatingData = {
    default: globalStubs,
    ...templatingData
  };

  for (const stub of stubs) {
    subject = stringUtils.replaceAll(subject, `{{${stub}}}`, get(templatingData, stub));
    content = stringUtils.replaceAll(content, `{{${stub}}}`, get(templatingData, stub));
  }

  // Check if there is missing stub
  if (content.match(/{{.*}}/)) {
    logger.error('There may be missing stub in notification template content', {
      content
    });
  }

  if (subject.match(/{{.*}}/)) {
    logger.error('There may be missing stub in notification template subject', {
      subject
    });
  }

  return {
    subject,
    content
  };
};