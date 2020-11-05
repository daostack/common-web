import * as functions from 'firebase-functions';

import { responseExecutor } from '../util/responseExecutor';
import { commonApp, commonRouter } from '../util/commonApp';

import { createCirclePayCard, assignCard } from './createCirclePayCard';
import { encryption } from './circlepay';

const runtimeOptions = {
  timeoutSeconds: 540
};

const circlepay = commonRouter();

circlepay.post('/create-card', async (req, res, next) => {
  await responseExecutor(
    async () => (await createCirclePayCard(req)),
    {
      req,
      res,
      next,
      successMessage: `CirclePay card created!`
    });
});

circlepay.post('/assign-card', async (req, res, next) => {
  await responseExecutor(
    async () => (await assignCard(req)), {
      req,
      res,
      next,
      successMessage: `CirclePay card assigned successfully!`
    });
});

circlepay.get('/encryption', async (req, res, next) => {
  console.log('index/encryption');
  await responseExecutor(
    async () => (await encryption()),
    {
      req,
      res,
      next,
      successMessage: `PCI encryption key generated!`
    });
});

export const circlepayApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(circlepay));
