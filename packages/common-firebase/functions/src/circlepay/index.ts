import * as functions from 'firebase-functions';
import request from 'request';

import { responseExecutor } from '../util/responseExecutor';
import { commonApp, commonRouter } from '../util/commonApp';

import { createCirclePayCard, testIP } from './createCirclePayCard';
import { encryption } from './circlepay';
import { CommonError } from '../util/errors';
import { handleNotification } from './handleNotification';
import { ICircleNotification } from '../util/types';
import { subscribeToNotifications } from './subscribeToNotifications';
import { createPayment } from './createPayment';

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

circlepay.get('/testIP', async (req, res, next) => {
  await responseExecutor(
    async () => (await testIP()),
    {
      req,
      res,
      next,
      successMessage: `Test Ip generated`
    });
});

circlepay.post('/notification/ping', async (req, res, next) => {
  console.info('Received notification from Circle');

  await responseExecutor(async () => {
    const envelope = JSON.parse(req.body);

    if (envelope.Type === 'SubscriptionConfirmation') {
      console.info('Trying to confirm subscription!', envelope.SubscribeURL);

      request(envelope.SubscribeURL, (err) => {
        if (err) {
          throw new CommonError('Something wrong happened verifying the request', {
              error: err,
              errorString: JSON.stringify(err)
            }
          );
        }

        console.info('Successfully subscribed to the notifications!');
      });
    } else if (envelope.Type === 'Notification') {
      await handleNotification(JSON.parse(envelope.Message) as ICircleNotification);
    } else {
      throw new CommonError(`Unsupported type: ${envelope.Type}`, {
        envelope,
        envelopeString: JSON.stringify(envelope)
      });
    }

    console.info('Successfully handled notification');
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

circlepay.post('/create-a-payment', async (req, res, next) => {    
   await responseExecutor(    
     async () => (await createPayment(req.body)),    
     {    
       req,    
       res,    
       next,    
       successMessage: `Payment was successful`    
     })    
 });

export const circlepayApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(circlepay));
