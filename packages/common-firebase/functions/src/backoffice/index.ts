import * as functions from 'firebase-functions';

import { commonApp, commonRouter } from '../util';
import { responseExecutor } from '../util/responseExecutor';
import { fillPayInSheet } from './business/fillPayInSheet';
import { fillPayOutSheet } from './business/fillPayOutSheet';
import { fillCircleBalanceSheet } from './business/fillCircleBalanceSheet';
import { fillCommonBalanceSheet } from './business/fillCommonBalanceSheet';
import { fillCircleBalanceSheetHistoricalSheet } from './business/fillCircleBalanceHistoricalSheet';
import { addCircleBalance } from './database/addCircleBalance';
import * as cron from './crons';

const runtimeOptions = {
  timeoutSeconds: 540 // Maximum time 9 mins
};

const router = commonRouter();

router.get('/test', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return addCircleBalance()
    }, {
      req,
      res,
      next,
      successMessage: `Added CircleBalance succesfully!`
    }
  );
});

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
router.get('/circlebalancehistorical', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return fillCircleBalanceSheetHistoricalSheet()
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
      return fillCircleBalanceSheet()
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
    unauthenticatedRoutes: [
      '/payin',
      '/payout',
      '/circlebalancehistorical',
      '/circlebalance',
      '/commonbalance',
      '/test'
    ]
  }));


  export const circleBalanceCrons = cron;
