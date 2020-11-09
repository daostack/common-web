const sgMail = require('@sendgrid/mail');
const {env} = require('./constants');
sgMail.setApiKey(env.mail.SENDGRID_API_KEY);

exports.sendMail = async (dest, subject, message) => {
  await sgMail.send({
    to: dest,
    from: env.mail.sender,
    subject: subject,
    text: message,
    html: message
  });
};