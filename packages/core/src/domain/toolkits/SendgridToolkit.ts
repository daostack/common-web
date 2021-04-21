import sendgrid from '@sendgrid/mail';
import { logger } from '@logger';

export const InitializeSendgrid = (): void => {
  logger.info('⚙️ Initializing SendGrid');

  sendgrid.setApiKey(process.env['Sendgrid.ApiKey'] as string);
};

export const sendMail: typeof sendgrid.send = (...data) => {
  sendgrid.setApiKey(process.env['Sendgrid.ApiKey'] as string);

  return sendgrid.send(...data);
};