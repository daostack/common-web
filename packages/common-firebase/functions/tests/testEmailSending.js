const { getTemplatedEmail } =  require('../email');
const { sendMail } = require('../mailer');


const testEmailSending = async (req) => {
  const { to, subject, message, template } = req.query;

  if(!to) {
    throw new Error("Email is not provided!");
  }

  if(!template) {
    await sendMail(
      to,
      subject || "Test email",
      message || "This is test email for testing the email sending capabilities of the application."
    );

    return "Email sent successfully!";
  }

  const templatedEmail = getTemplatedEmail('requestToJoinSubmitted', {
    emailStubs: {
      name: "Test Email",
      commonName: "New",
      link: "https://www.google.com/?client=safari",
      // supportChatLink: "https://www.google.com/?client=safari"
    }
  })

  await sendMail(
    to,
    templatedEmail.subject,
    templatedEmail.template
  );

  return "Templated email sent successfully!";
};

module.exports = { testEmailSending };
