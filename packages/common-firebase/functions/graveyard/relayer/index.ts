import * as functions from 'firebase-functions';

import { Utils } from '../util/util';
import { commonApp, commonRouter } from '../util/commonApp';
import { responseExecutor } from '../util/responseExecutor';

import Relayer from './relayer';
import { createWallet } from './createWallet';
import { execTransaction } from './util/execTransaction';
import { createRequestToJoin } from './createRequestToJoin';

const runtimeOptions = {
  timeoutSeconds: 540 // Maximum time 9 mins
};

// create an Arc instance
const relayerRouter = commonRouter();


relayerRouter.get('/createWallet', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await createWallet(req);
    }, {
      req,
      res,
      next,
      successMessage: `Created wallet!`
    }
  );
});

relayerRouter.post('/requestToJoin', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await createRequestToJoin(req, res);
    }, {
      req,
      res,
      next,
      successMessage: `Created request to join!`
    }
  );
});

relayerRouter.get('/addWhitleList', async (req, res, next) => {
  await responseExecutor(
    async () => {
      const idToken = req.header('idToken');
      const uid = await Utils.verifyId(idToken);
      const userData = await Utils.getUserById(uid);
      const address = userData.safeAddress;

      return await Relayer.addProxyToWhitelist([address]);
    }, {
      req,
      res,
      next,
      successMessage: `Added white list!`
    }
  );
});

relayerRouter.post('/execTransaction', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await execTransaction(req);
    }, {
      req,
      res,
      next,
      successMessage: `Executed transaction!`
    }
  );
});

export const relayerApp = functions.runWith(runtimeOptions)
  .https.onRequest(commonApp(relayerRouter));
