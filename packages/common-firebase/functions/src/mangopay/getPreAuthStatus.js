const viewPreauthorization = require('./mangopay').viewPreauthorization;

const sendPreauthorizationFailedEmail = require('../email/sendPreauthorizationFailedEmail');

const getPreAuthStatus = async (req) => {
  const { preAuthId } = req.body;
  const { Status } = await viewPreauthorization(preAuthId);

  if (Status === 'FAILED') {
    await sendPreauthorizationFailedEmail(preAuthId, '3D Authentication FAILURE');
  }

  return {
    Status,
    message: 'PreauthStatus',
  };

}

module.exports = { getPreAuthStatus };
