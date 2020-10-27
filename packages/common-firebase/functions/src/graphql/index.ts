import * as functions from 'firebase-functions';

import { updateDAOBalance } from '../db/daoDbService';
import { commonApp, commonRouter } from '../util/commonApp';
import { responseExecutor } from '../util/responseExecutor';
import { fetchAllContracts } from '../settings';

import { updateDaoById, updateDaos } from './dao';
import { updateProposalById, updateProposals } from './proposal';
import { getPublicSettings } from './settings';
import { updateUsers } from './user';
import { updateVotes } from './vote';


const runtimeOptions = {
  timeoutSeconds: 540 // Maximum time 9 mins
};

const graphqlRouter = commonRouter();

graphqlRouter.get('/update-daos', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await updateDaos();
    }, {
      req,
      res,
      next,
      successMessage: `Updated DAOs successfully!`
    }
  );
});

graphqlRouter.get('/update-dao-by-id', async (req, res, next) => {
  const { daoId, retries } = req.query;
  await responseExecutor(
    async () => {
      console.log('hey');

      const res = await updateDaoById(daoId, { retries: retries || 0 });
      console.log('there');

      return res;
    }, {
      req,
      res,
      next,
      successMessage: `Updated dao with id ${daoId}!`
    }
  );
});

graphqlRouter.get('/update-proposals', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await updateProposals();
    }, {
      req,
      res,
      next,
      successMessage: `Updated proposals!`
    }
  );
});

graphqlRouter.get('/update-proposal-by-id', async (req, res, next) => {
  const { proposalId, retries, blockNumber } = req.query;

  await responseExecutor(
    async () => {
      return await updateProposalById(proposalId, { retries: retries || 0 }, blockNumber);
    }, {
      req,
      res,
      next,
      successMessage: `Updated proposal ${proposalId}!`
    }
  );
});

graphqlRouter.get('/update-users', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await updateUsers();
    }, {
      req,
      res,
      next,
      successMessage: `Updated users successfully!`
    }
  );
});

graphqlRouter.get('/update-votes', async (req, res, next) => {
  await responseExecutor(
    async () => {
      return await updateVotes();
    }, {
      req,
      res,
      next,
      successMessage: `Updated votes successfully!`
    }
  );
});

graphqlRouter.get('/update-dao-balance', async (req, res, next) => {
  const { daoId } = req.query;

  await responseExecutor(
    async () => {
      return await updateDAOBalance(daoId);
    }, {
      req,
      res,
      next,
      successMessage: `Updated balance of Common at ${daoId}!`
    }
  );
});

graphqlRouter.get('/settings', async (req, res, next) => {
  await responseExecutor(() => getPublicSettings(req), {
    req,
    res,
    next,
    successMessage: 'Setting successfully acquired!'
  });
});

graphqlRouter.get('/fetch-contractinfos', async (req, res, next) => {
  await responseExecutor(() =>  fetchAllContracts(false), {
    req,
    res,
    next,
    successMessage: 'Setting successfully acquired!',
  });
});


export const graphqlApp = functions
  .runWith(runtimeOptions)
  .https.onRequest(commonApp(graphqlRouter));
