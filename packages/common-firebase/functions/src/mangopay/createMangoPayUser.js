const { Utils } = require('../util/util');
const {
  createUser,
  checkMangopayUserValidity,
} = require('./mangopay');

const createMangoPayUser = async (req) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let result;
    let isValid = false;
    const { idToken } = req.body;
    const uid = await Utils.verifyId(idToken);
    const userData = await Utils.getUserById(uid);
    const userRef = Utils.getUserRef(uid);

    if (userData.mangopayId) {
      isValid = checkMangopayUserValidity(userData.mangopayId);
    }

    if (!userData.mangopayId || !isValid) {
      const { Id: mangopayId } = await createUser(userData);
      await userRef.update({ mangopayId });
      result = 'Created new user in mangopay.';
    }
    // we don't need wallet for preAuthorization
    /* userData = await userRef.get().then(doc => { return doc.data() }); // update document if changes
    if (!userData.mangopayWalletId) {
      const { Id: mangopayWalletId } = await createWallet(userData.mangopayId);
      await userRef.update({ mangopayWalletId });
    } */

    return {
      message: `Mangopay user status: ${
        result ? result : 'User is already registred in mangopay.'
      }`,
    }

  } catch (error) {
    throw error; 
  }
}

 module.exports = { createMangoPayUser };
