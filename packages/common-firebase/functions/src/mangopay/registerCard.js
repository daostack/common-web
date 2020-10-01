const { Utils } = require('../util/util');
const {
  finalizeCardReg,
  preauthorizePayment,
} = require('./mangopay');

const sendPreauthorizationFailedEmail = require('../email/sendPreauthorizationFailedEmail');


const registerCard = async (req) => {
  // eslint-disable-next-line no-useless-catch

  const { idToken, cardRegistrationData, Id, funding } = req.body;
  const uid = await Utils.verifyId(idToken);
  let userData = await Utils.getUserById(uid);
  const userRef = Utils.getUserRef(uid);
  const cardId = await finalizeCardReg(cardRegistrationData, Id);
  console.log('CARD REGISTERED', cardId);
  await userRef.update({ mangopayCardId: cardId });
  userData = await Utils.getUserById(uid); // update userData with the new cardId which we register each time user pays
  const {
    Id: preAuthId,
    Status,
    DebitedFunds: { Amount },
    ResultMessage,
  } = await preauthorizePayment({ funding, userData });

  if (Status === 'FAILED') {
    await sendPreauthorizationFailedEmail(preAuthId)

    throw new Error(`Request to join failed. ${ResultMessage}`);
  }

  return {
    message: 'Card registered successfully',
    preAuthData: { preAuthId, Amount },
  }
}

module.exports = { registerCard };
