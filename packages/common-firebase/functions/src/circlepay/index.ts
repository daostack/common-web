import * as functions from 'firebase-functions';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import { responseExecutor } from '../util/responseExecutor';

import { createCirclePayCard, assignCard } from './createCirclePayCard';
import { createPayment } from './createPayment';
import { encryption } from './circlepay';

export const circlepay = express();

const runtimeOptions = {
  timeoutSeconds: 540
};

circlepay.set('trust proxy', true);
circlepay.use(bodyParser.json());
circlepay.use(
  bodyParser.urlencoded({
    extended: true
  })
);
circlepay.use(express.json()); // to support JSON-encoded bodies
circlepay.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
circlepay.use(cors({ origin: true }));

circlepay.post('/create-card', async (req, res) => {
  await responseExecutor(
    async () => (await createCirclePayCard(req)),
    {
      req,
      res,
      successMessage: `CirclePay card created!`
    });
});

circlepay.post('/assign-card', async (req, res) => {
  await responseExecutor(
    async () => (await assignCard(req)), {
    req,
    res,
    successMessage: `CirclePay card assigned successfully!`
  });
});

circlepay.get('/encryption', async (req, res) => {
  console.log('index/encryption');
  await responseExecutor(
    async () => (await encryption()),
    {
      req,
      res,
      successMessage: `PCI encryption key generated!`
    });
});

circlepay.post('/create-a-payment', async (req, res) => {
  console.log('index/create-a-payment');
  await responseExecutor(
    async () => (await createPayment(req.body)),
    {
      req,
      res,
      successMessage: `Payment was successful`
    });
});

exports.circlepay = functions
  .runWith(runtimeOptions)
  .https
  .onRequest(circlepay);
