const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const mangopay = express();
const cors = require('cors');
const {createMangoPayUser} = require('./createMangoPayUser');
const {getCardRegistration} = require('./getCardRegistration')
const {registerCard} = require('./registerCard');
const {getPreAuthStatus} = require('./getPreAuthStatus');

const runtimeOptions = {
  timeoutSeconds: 540, // Maximum time 9 mins
};

mangopay.use(bodyParser.json()); // to support JSON-encoded bodies
mangopay.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
mangopay.use(express.json()); // to support JSON-encoded bodies
mangopay.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
mangopay.use(cors({ origin: true }));

mangopay.post('/create-user', async (req, res) => {
  try {
    const data = await createMangoPayUser(req);
    res.send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: e.response ? e.response.data.Message : e.message });
  }
});

mangopay.post('/get-card-registration', async (req, res) => {
  try {
    const data = await getCardRegistration(req)
    res.send(data);
  } catch (e) {
    console.log('Error in pre card registration', e);
    res.status(500).send({ error: 'Error getting card registration.' });
  }
});

mangopay.post('/register-card', async (req, res) => {
  try {
    const data = await registerCard(req)
    res.send(data);
  } catch (e) {
    console.log(
      'Error in finalizing card registration and preauthorization',
      e
    );
    res.status(500).send({ error: e.response ? e.response.data.Message : e.message });
  }
});

mangopay.post('/get-preauthorisation-status', async (req, res) => {
  try {
    const data = await getPreAuthStatus(req)
    res.send(data);
  } catch (e) {
    console.log('Error viewing preauthorization', e);
    res.status(500).send({ error: `${e}` });
  }
});

exports.mangopay = functions.runWith(runtimeOptions).https.onRequest(mangopay);
