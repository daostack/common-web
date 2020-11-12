const { getSecret } = require('./settings');
const sgMail = require('@sendgrid/mail');
const { env } = require('./constants');
const SENDGRID_APIKEY = 'SENDGRID_APIKEY';

const setApiKey = async () => {
	const apiKey = await getSecret(SENDGRID_APIKEY);
	sgMail.setApiKey(apiKey);
}

exports.sendMail = async (dest, subject, message) => {
await setApiKey();
  await sgMail.send({
    to: dest,
    from: env.mail.sender,
    subject: subject,
    text: message,
    html: message
  });
};