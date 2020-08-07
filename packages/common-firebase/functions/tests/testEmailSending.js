const { sendMail } = require('../mailer');

const testEmailSending = async (req) => {
  const { to, subject, message } = req.query;

  if(!to) {
    throw new Error("Email is not provided!");
  }

  await sendMail(
    to,
    subject || "Test email",
    message || "This is test email for testing the email sending capabilities of the application."
  );

  return "Email sent successfully!";
};

module.exports = { testEmailSending };