import * as functions from 'firebase-functions';
import request from 'request';
import axios from 'axios';

import * as payoutCrons from './payouts/crons';

import { commonApp, commonRouter, externalRequestExecutor } from '../util';
import { ICircleNotification } from '../util/types';
import { responseExecutor } from '../util/responseExecutor';
import { CommonError } from '../util/errors';
import { handleNotification } from './notifications/bussiness/handleNotification';
import { subscribeToNotifications } from './notifications/bussiness/subscribeToNotifications';
import { circlePayApi, getSecret } from '../settings';
import { createCard } from './cards/business/createCard';
import { ErrorCodes } from '../constants';
import { createBankAccount } from './backAccounts/bussiness/createBankAccount';
import { createProposalPayout } from './payouts/business/createProposalPayout';
import { approvePayout } from './payouts/business/approvePayout';
import { createIndependentPayout } from './payouts/business/createIndependentPayout';
import { chargeSubscription, chargeSubscriptions, revokeMemberships } from '../subscriptions/business';
import { subscriptionDb } from '../subscriptions/database';

const runtimeOptions = {
  timeoutSeconds: 540
};

const CIRCLEPAY_APIKEY = 'CIRCLEPAY_APIKEY';
export const getCircleHeaders = async (): Promise<any> => (
  getSecret(CIRCLEPAY_APIKEY).then((apiKey) => (
    {
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${apiKey}`,
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

circlepay.post('/payouts/create', async (req, res, next) => {
  await responseExecutor(async () => {
    if (req.body.wire) {
      const bankAccount = await createBankAccount(req.body.wire);

      if (req.body.payout.type === 'proposal') {
        await createProposalPayout({
          ...req.body.payout,
          bankAccountId: bankAccount.id
        });
      } else if (req.body.payout.type === 'independent') {
        await createIndependentPayout({
          ...req.body.payout,
          bankAccountId: bankAccount.id
        });
      }
    } else {
      if (req.body.type === 'proposal') {
        await createProposalPayout(req.body);
      } else if (req.body.type === 'independent') {
        await createIndependentPayout(req.body);
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

circlepay.get('/test', async (req, res) => {
  await Promise.all([
    chargeSubscriptions(),
    revokeMemberships()
  ]);

  res.send('done');
})

circlepay.get('/charge/subscription', async (req, res) => {
  const subscription = await subscriptionDb.get(req.query.id as string);

  try {
    await chargeSubscription(subscription);

    res.status(200)
      .send('done');
  } catch (e) {
    res.status(500)
      .send(e);
  }
})

export const circlePayCrons = {
  ...payoutCrons
};

export const circlePayApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(circlepay, {
    unauthenticatedRoutes: [
      '/payouts/approve',
      '/charge/subscription',
      '/test'
    ]
  }));
