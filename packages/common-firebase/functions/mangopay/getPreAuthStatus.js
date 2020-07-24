const { env } = require('../env');
const {
  viewPreauthorization,
} = require('./mangopay');
const { sendMail, MAIL_SUBJECTS } = require('../mailer');

const getPreAuthStatus = async (req) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { preAuthId } = req.body;
    const { Status, DebitedFunds: { Amount }, AuthorId } = await viewPreauthorization(preAuthId);
    if (Status === 'FAILED') { // this is 3d Authentitacion FAILURE
      sendMail(env.mail.adminMail, MAIL_SUBJECTS.PREAUTH_FAIL, `3D authentication failed for ${Amount}$ for user with mangopayId ${AuthorId}`);
    }
    return { message: 'PreauthStatus', Status };

  } catch (error) {
    throw error; 
  }
}

 module.exports = { getPreAuthStatus };
