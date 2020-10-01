const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const mangopay = express();
const cors = require('cors');
const {createMangoPayUser} = require('./createMangoPayUser');
const {getCardRegistration} = require('./getCardRegistration')
const {registerCard} = require('./registerCard');
const { getPreAuthStatus } = require('./getPreAuthStatus');
const { responseExecutor } = require('../util/responseExecutor');

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
  //res.status(500).send({ error: e.response ? e.response.data.Message : e.message });
  responseExecutor(
    async () => {
      return await createMangoPayUser(req);
    },
    {
      req,
      res,
      successMessage: `Created mangopay user!`,
      errorMessage: `Unable to create MangoPay user!`
    }
  );
});

mangopay.post('/get-card-registration', async (req, res) => {
  responseExecutor(
    async () => {
      return await getCardRegistration(req);
    },
    {
      req,
      res,
      successMessage: `Got a card registration!`,
      errorMessage: `Error getting card registration.!`
    }
  );
});

mangopay.post('/register-card', async (req, res) => {
  //res.status(500).send({ error: e.response ? e.response.data.Message : e.message });
  responseExecutor(
    async () => {
      return await registerCard(req);
    },
    {
      req,
      res,
      successMessage: `Registered MangoPay card!`,
      errorMessage: `Error in finalizing card registration and preauthorization!`
    }
  );
});

mangopay.post('/get-preauthorisation-status', async (req, res) => {
  responseExecutor(
    async () => {
      return await getPreAuthStatus(req);
    },
    {
      req,
      res,
      successMessage: `Got preauthorisation status!`,
      errorMessage: `Error in getting preauthorization!`
    }
  );
});

exports.mangopay = functions.runWith(runtimeOptions).https.onRequest(mangopay);
