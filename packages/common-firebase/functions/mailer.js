const sgMail = require('@sendgrid/mail');
const env = require('./env/env.json');
sgMail.setApiKey(env.mail.SENDGRID_API_KEY);

exports.sendMail = (dest, subject, message) => {
  const msg = {
    to: dest,
    from: env.mail.sender, // it strange  it's required because in the sendGrid configuration it's already specified
    subject: subject,
    text: message,
    html: message,
  };
  sgMail.send(msg);
};
