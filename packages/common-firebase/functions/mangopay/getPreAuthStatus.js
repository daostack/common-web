const viewPreauthorization = require('./mangopay').viewPreauthorization;

const emailClient = require('../email');

const getPreAuthStatus = async (req) => {
  const { preAuthId } = req.body;
  const { Status } = await viewPreauthorization(preAuthId);

  if (Status === 'FAILED') {
    await emailClient.sendPreauthorizationFailedEmail(preAuthId, '3D Authentication FAILURE');
  }

  return {
    Status,
    message: 'PreauthStatus',
  };

}

module.exports = { getPreAuthStatus };
