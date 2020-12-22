import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { responseExecutor } from '../util/responseExecutor';
import {fillPayInSheet, fillPayOutSheet, filCircleBalanceSheet, fillCommonBalanceSheet} from './business'


const runtimeOptions = {
  timeoutSeconds: 540 // Maximum time 9 mins
};

const router = commonRouter();

router.get('/payout', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return fillPayOutSheet()
    }, {
      req,
      res,
      next,
      successMessage: `Fetch PAYOUT succesfully!`
    }
  );
});

router.get('/payin', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return fillPayInSheet()
    }, {
      req,
      res,
      next,
      successMessage: `Fetch PAYIN succesfully!`
    }
  );
});

router.get('/commonbalance', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return fillCommonBalanceSheet()
    }, {
      req,
      res,
      next,
      successMessage: `Fetch BALANCE succesfully!`
    }
  );
});

router.get('/circlebalance', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return filCircleBalanceSheet()
    }, {
      req,
      res,
      next,
      successMessage: `Fetch BALANCE succesfully!`
    }
  );
});

export const backofficeApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(router, {
    unauthenticatedRoutes:[
      '/payin', 
      '/payout', 
      '/circlebalance', 
      '/commonbalance'
    ]
  }));