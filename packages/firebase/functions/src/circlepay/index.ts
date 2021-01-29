import * as functions from 'firebase-functions';
import { v4 } from 'uuid';
import axios from 'axios';

import * as payoutCrons from './payouts/crons';
import * as paymentCrons from './payments/crons';

import { commonApp, commonRouter, externalRequestExecutor } from '../util';
import { responseExecutor } from '../util/responseExecutor';
import { circlePayApi, getSecret } from '../settings';
import { ArgumentError } from '../util/errors';
import { ErrorCodes } from '../constants';

import { createCard } from './cards/business/createCard';
import { createBankAccount } from './backAccounts/bussiness/createBankAccount';

import { approvePayout } from './payouts/business/approvePayout';
import { updatePaymentFromCircle } from './payments/business/updatePaymentFromCircle';
import { createPayout } from './payouts/business/createPayout';

const runtimeOptions = {
  timeoutSeconds: 540
};

const CIRCLEPAY_APIKEY = 'CIRCLEPAY_APIKEY';

export const getCircleHeaders = async (): Promise<any> => (
  getSecret(CIRCLEPAY_APIKEY).then((apiKey) => (
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
  )
);


const circlepay = commonRouter();

circlepay.post('/create-card', async (req, res, next) => {
  await responseExecutor(
    async () => (await createCard({
      ...req.body,
      ipAddress: '127.0.0.1', // @todo Strange. There is no Ip to be find in the request object. Make it be :D
      ownerId: req.user.uid,
      sessionId: req.requestId
    })),
    {
      req,
      res,
      next,
      successMessage: `CirclePay card created successfully!`
    });
});

circlepay.get('/encryption', async (req, res, next) => {
  await responseExecutor(
    async () => {

      const options = await getCircleHeaders();
      const response = await externalRequestExecutor(async () => {
        return await axios.get(`${circlePayApi}/encryption/public`, options);
      }, {
        errorCode: ErrorCodes.CirclePayError,
        userMessage: 'Call to CirclePay failed. Please try again later and if the issue persist contact us.'
      });

      return response.data;
    },
    {
      req,
      res,
      next,
      successMessage: `PCI encryption key generated!`
    });
});

// ----- Payment Related requests

circlepay.get('/payments/update/data', async (req, res, next) => {
  await responseExecutor(async () => {
    const trackId = req.requestId || v4();
    const paymentId = req.query.paymentId;

    if (!paymentId) {
      throw new ArgumentError('paymentId');
    }

    logger.notice('User requested update for all payments from circle', {
      userId: req.user?.uid
    });

    await updatePaymentFromCircle(paymentId as string, trackId);
  }, {
    req,
    res,
    next,
    successMessage: 'Payment update succeeded'
  });
});


circlepay.get('/testIP', async (req, res, next) => {
  await responseExecutor(
    async () => {
      const response = await axios.get('https://api.ipify.org?format=json');
      return {
        ip: response.data
      };
    }, {
      req,
      res,
      next,
      successMessage: `Test Ip generated`
    });
});

// ----- Bank Accounts

circlepay.post('/wires/create', async (req, res, next) => {
  await responseExecutor(async () => {
    const data = await createBankAccount(req.body);

    return {
      id: data.id
    };
  }, {
    req,
    res,
    next,
    successMessage: 'Done!'
  });
});

// ----- Payouts

circlepay.get('/payouts/create', async (req, res, next) => {
  await responseExecutor(async () => {

    const obj = JSON.parse(JSON.stringify(req.query));
    const payload = JSON.parse(obj.payload);

    const bankAccountId = payload.wire
      ? (await createBankAccount(payload.wire)).id
      : payload.bankAccountId;

    const payoutCreationPayload = payload.payout || payload;

    await createPayout({
      bankAccountId,
      ...payoutCreationPayload
    });
  }, {
    req,
    res,
    next,
    successMessage: 'Payout created'
  });
});

circlepay.get('/payouts/approve', async (req, res, next) => {
  await responseExecutor(async () => {
    return {
      approved: await approvePayout(req.query)
    };
  }, {
    req,
    res,
    next,
    successMessage: 'Payout created'
  });
});

export const circlePayCrons = {
  ...payoutCrons,
  ...paymentCrons
};

export const circlePayApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(circlepay, {
    unauthenticatedRoutes: [
      '/payouts/approve',
      '/charge/subscription',
      '/payouts/create',
      '/testIP'
    ]
  }));
