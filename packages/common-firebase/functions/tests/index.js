const app = require('express')();
const functions = require('firebase-functions');

const {
  testEmailSending,
  testDaoCreationEmails,
  testPreauthFailedEmails
  // testEmailProposalsEmails
} = require('./testEmailSending');

const runtimeOptions = {
  timeoutSeconds: 540
};

const processReq = async (req, res, func) => {
  try {
    const result = await func();

    res.status(200).send({
      message: 'Email processed successfully.',
      data: {
        response: result
      }
    });
  } catch (e) {
    res.status(500).send({
      message: 'An error occurred while trying to send the email',
      error: e.message
    });
  }
};


app.get('/sendEmail', async (req, res) => {
  await processReq(req, res, async () => {
    return await testEmailSending(req);
  });
});

app.get('/sendNewDaoEmails', async (req, res) => {
  await processReq(req, res, async () => {
    return await testDaoCreationEmails(req);
  });
});

app.get('/sendPreauthFailedEmails', async (req, res) => {
  await processReq(req, res, async () => {
    return await testPreauthFailedEmails(req);
  });
});

app.get('/backup', async (req, res) => {
  res.send(await require('@util/backup').backup())
})

exports.tests = functions
  .runWith(runtimeOptions)
  .https.onRequest(app);



