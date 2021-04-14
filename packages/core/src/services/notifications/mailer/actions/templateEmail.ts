import { get } from 'lodash';
import { NotificationTemplate } from '@prisma/client';

import { logger } from '@logger';

export interface ITemplatedEmail {
  subject: string;
  content: string;
}

const globalStubs = {
  supportChatLink: 'https://common.io/help'
};

const replaceAll = (string: string, search: string, replace: string): string => {
  return string.split(search).join(replace);
};

export const templateEmail = (templatingData: any, template: NotificationTemplate): ITemplatedEmail => {
  let { subject, content, stubs } = template;

  templatingData = {
    default: globalStubs,
    ...templatingData
  };

  for (const stub of stubs) {
    subject = replaceAll(subject, `{{${stub}}}`, get(templatingData, stub));
    content = replaceAll(content, `{{${stub}}}`, get(templatingData, stub));
  }

  // Check if there is missing stub
  if (content.match(/{{.*}}/)) {
    logger.error('There may be missing stub in email template content', {
      content
    });
  }

  if (subject.match(/{{.*}}/)) {
    logger.error('There may be missing stub in email template subject', {
      subject
    });
  }

  return {
    subject,
    content
  };
};