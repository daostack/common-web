const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const mangopay = express();
const cors = require('cors');

const {
  createUser,
  checkMangopayUserValidity,
  getCardRegistrationObject,
  finalizeCardReg,
  preauthorizePayment,
  viewPreauthorization,
} = require('./mangopay');

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
    let result;
    let isValid = false;
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userRef = admin.firestore().collection('users').doc(decodedToken.uid);
    let userData = await userRef.get().then((doc) => {
      return doc.data();
    });

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
    res.status(200).send({
      message: `Mangopay user status: ${
        result ? result : 'User is already registred in mangopay.'
      }`,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: 'Error in creating mangopay user' });
  }
});

mangopay.post('/get-card-registration', async (req, res) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userRef = admin.firestore().collection('users').doc(decodedToken.uid);
    let userData = await userRef.get().then((doc) => {
      return doc.data();
    });
    const preRegData = await getCardRegistrationObject(userData);
    res.status(200).send({ preRegData });
  } catch (e) {
    console.log('Error in pre card registration', e);
    res.status(500).send({ error: 'Error getting card registration.' });
  }
});

mangopay.post('/register-card', async (req, res) => {
  try {
    const { idToken, cardRegistrationData, Id, funding } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userRef = admin.firestore().collection('users').doc(decodedToken.uid);
    let userData = await userRef.get().then((doc) => {
      return doc.data();
    });
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
      throw new Error(`Request to join failed. ${ResultMessage}`);
    } else {
      res.status(200).send({
        message: 'Card registered successfully',
        preAuthData: { preAuthId, Amount },
      });
    }
  } catch (e) {
    console.log(
      'Error in finalizing card registration and preauthorization',
      e
    );
    res.status(500).send({ error: e });
  }
});

mangopay.post('/get-preauthorisation-status', async (req, res) => {
  try {
    const { preAuthId } = req.body;
    const { Status } = await viewPreauthorization(preAuthId);
    res.status(200).send({ message: 'PreauthStatus', Status });
  } catch (e) {
    console.log('Error viewing preauthorization', e);
    res.status(500).send({ error: `${e}` });
  }
});

exports.mangopay = functions.runWith(runtimeOptions).https.onRequest(mangopay);
