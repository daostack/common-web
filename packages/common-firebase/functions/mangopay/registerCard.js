const Utils = require('../util/util');
const { env } = require('../env');
const {
  finalizeCardReg,
  preauthorizePayment,
} = require('./mangopay');
const { sendMail, MAIL_SUBJECTS } = require('../mailer');

const registerCard = async (req) => {
  // eslint-disable-next-line no-useless-catch
  try {

    const { idToken, cardRegistrationData, Id, funding } = req.body;
    const uid = await Utils.verifyIdToken(idToken);
    const userData = await Utils.getUserById(uid);
    const userRef = Utils.getUserRef(uid);
    const cardId = await finalizeCardReg(cardRegistrationData, Id);
    console.log('CARD REGISTERED', cardId);
    await userRef.update({ mangopayCardId: cardId });
    const {
      Id: preAuthId,
      Status,
      DebitedFunds: { Amount },
      ResultMessage,
    } = await preauthorizePayment({ funding, userData });
    if (Status === 'FAILED') {
      sendMail(env.mail.adminMail, MAIL_SUBJECTS.PREAUTH_FAIL, `Preauthorization failed for ${funding}$ for userID ${userData.uid}`);
      throw new Error(`Request to join failed. ${ResultMessage}`);
    }

    return {
      message: 'Card registered successfully',
      preAuthData: { preAuthId, Amount },
    }

  } catch (error) {
    throw error; 
  }
}

 module.exports = { registerCard };
