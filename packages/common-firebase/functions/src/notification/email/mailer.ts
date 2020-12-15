import sendgrid from '@sendgrid/mail';

import { env } from '../../constants';
import { getSecret } from '../../settings';

const SENDGRID_APIKEY = 'SENDGRID_APIKEY';

const setApiKey = async () => {
  const apiKey = await getSecret(SENDGRID_APIKEY);
  sendgrid.setApiKey(apiKey);
}

export const sendMail = async (dest: string, subject: string, message: string): Promise<void> => {
  // @question Moore, why are we awaiting this on every single mail we send?
  await setApiKey();

  await sendgrid.send({
    to: dest,
    from: env.mail.sender,
    subject: subject,
    text: message,
    html: message
  });
};