const Utils = require('../util/util');
const {
  getCardRegistrationObject,
} = require('./mangopay');

const getCardRegistration = async (req) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { idToken } = req.body;
    const uid = await Utils.verifyId(idToken);
    const userData = await Utils.getUserById(uid);
    const preRegData = await getCardRegistrationObject(userData);
    return {preRegData};
  } catch (error) {
    throw error; 
  }
}

 module.exports = { getCardRegistration };
