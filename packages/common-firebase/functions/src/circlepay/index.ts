import * as functions from 'firebase-functions';
import request from 'request';
import axios from 'axios';
import { v4 } from 'uuid';

import * as payoutCrons from './payouts/crons';

import { commonApp, commonRouter, externalRequestExecutor } from '../util';
import { responseExecutor } from '../util/responseExecutor';
import { ICircleNotification } from '../util/types';
import { CommonError } from '../util/errors';
import { circlePayApi, getSecret } from '../settings';
import { ErrorCodes } from '../constants';


import { handleNotification } from './notifications/bussiness/handleNotification';
import { subscribeToNotifications } from './notifications/bussiness/subscribeToNotifications';

import { createCard } from './cards/business/createCard';
import { createBankAccount } from './backAccounts/bussiness/createBankAccount';

import { approvePayout } from './payouts/business/approvePayout';
import { createProposalPayout } from './payouts/business/createProposalPayout';
import { createIndependentPayout } from './payouts/business/createIndependentPayout';
import { updatePaymentFromCircle } from './payments/business/updatePaymentFromCircle';
import { updatePaymentsFromCircle } from './payments/business/updatePaymentsFromCircle';
import { updatePayments } from './payments/helpers';
import { updatePaymentStructure } from './payments/helpers/converter';

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
circlepay.get('/payments/update/structure', async (req, res, next) => {
  await responseExecutor(async () => {
    const trackId = req.requestId || v4();

    logger.notice('User requested update for all payments structure', {
      userId: req.user?.uid
    });

    await updatePayments(trackId);
  }, {
    req,
    res,
    next,
    successMessage: 'Payment update succeeded'
  });
});

circlepay.get('/payments/update/data', async (req, res, next) => {
  await responseExecutor(async () => {
    const trackId = req.requestId || v4();

    logger.notice('User requested update for all payments from circle', {
      userId: req.user?.uid
    });

    await updatePaymentsFromCircle(trackId);
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

circlepay.post('/notification/ping', async (req, res, next) => {
  logger.info('Received notification from Circle');

  await responseExecutor(async () => {
    const envelope = JSON.parse(req.body);

    if (envelope.Type === 'SubscriptionConfirmation') {
      logger.info('Trying to confirm subscription!', envelope.SubscribeURL);

      request(envelope.SubscribeURL, (err) => {
        if (err) {
          throw new CommonError('Something wrong happened verifying the request', {
              error: err,
              errorString: JSON.stringify(err)
            }
          );
        }

        logger.info('Successfully subscribed to the notifications!');
      });
    } else if (envelope.Type === 'Notification') {
      await handleNotification(JSON.parse(envelope.Message) as ICircleNotification);
    } else {
      throw new CommonError(`Unsupported type: ${envelope.Type}`, {
        envelope,
        envelopeString: JSON.stringify(envelope)
      });
    }

    logger.info('Successfully handled notification');
  }, {
    req,
    res,
    next,
    successMessage: 'Successfully handled notification'
  });
});

circlepay.post('/notification/register', async (req, res, next) => {
  await responseExecutor(async () => {
    return await subscribeToNotifications();
  }, {
    req,
    res,
    next,
    successMessage: 'Endpoints registered!'
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


    if (payload.wire) {
      const bankAccount = await createBankAccount(payload.wire);

      if (payload.payout.type === 'proposal') {
        await createProposalPayout({
          ...payload.payout,
          bankAccountId: bankAccount.id
        });
      } else if (payload.payout.type === 'independent') {
        await createIndependentPayout({
          ...payload.payout,
          bankAccountId: bankAccount.id
        });
      }
    } else {
      if (payload.type === 'proposal') {
        await createProposalPayout(payload);
      } else if (payload.type === 'independent') {
        await createIndependentPayout(payload);
      }
    }
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
  ...payoutCrons
};

export const circlePayApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(circlepay, {
    unauthenticatedRoutes: [
      '/payments/update/structure',
      '/payments/update/data',
      '/payouts/approve',
      '/charge/subscription',
      '/payouts/create',
      '/testIP'
    ]
  }));
