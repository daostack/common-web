const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const mangopay = express();
const cors = require('cors');

const {
  createUser,
  // createWallet,
  /*registerCard,
  payToDAOStackWallet, */
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
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userRef = admin.firestore().collection('users').doc(decodedToken.uid);
    let userData = await userRef.get().then(doc => { return doc.data() });
    if (!userData.mangopayId) {
      const { Id: mangopayId } = await createUser(userData);
      await userRef.update({ mangopayId });
      result = 'Created new user in mangopay.'
    }
  // we don't need wallet for preAuthorization
    /* userData = await userRef.get().then(doc => { return doc.data() }); // update document if changes
    if (!userData.mangopayWalletId) {
      const { Id: mangopayWalletId } = await createWallet(userData.mangopayId);
      await userRef.update({ mangopayWalletId });
    } */
    const code = 200;
    res.status(code).send(`Mangopay user status: ${result ? result : 'User is already registred in mangopay.'}`);
  } catch (e) {
    const code = 500;
    console.log(e);
    res.status(code).send(new Error(`Unable to create mangopay user: ${e}`));
  }
});


exports.mangopay = functions.runWith(runtimeOptions).https.onRequest(mangopay);
