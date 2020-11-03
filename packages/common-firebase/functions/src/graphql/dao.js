const { findUserByAddress } = require('../db/userDbService');
const { getArc, retryOptions, ipfsDataVersion } = require('../settings');
const { getBalance } = require('../db/daoDbService');
const promiseRetry = require('promise-retry');
const { CommonError } = require('../util/errors');
const { PROPOSAL_TYPE } = require('../util/util');
const { validateBlockNumber } = require('./util/util');

const { updateDao, getDaoById } = require('../db/daoDbService');

// get all DAOs data from graphql and read it into the subgraph
const updateDaos = async () => {
  const arc = await getArc();
  console.log('UPDATE DAOS:');

  const allDaos = [];
  let currDaos = null;
  let skip = 0;

  do {
    // eslint-disable-next-line no-await-in-loop
    currDaos = await arc.daos({ first: 1000, skip: skip * 1000 }, { fetchPolicy: 'no-cache' }).first();
    allDaos.push(...currDaos);
    skip++;
  } while (currDaos && currDaos.length > 0);

  const updatedDaos = [];
  const skippedDaos = [];

  console.log(`Found ${allDaos.length} DAOs`);

  await Promise.all(allDaos.map(async (dao) => {
    console.log(`UPDATE DAO WITH ID: ${dao.id}`);

    const { errorMsg } = await _updateDaoDb(dao);

    // TODO: this is not the way to handle errors
    if (errorMsg) {
      skippedDaos.push(errorMsg);
      console.error(errorMsg, new CommonError(errorMsg));

      return;
    }

    const msg = `Updated dao ${dao.id}`;
    updatedDaos.push(msg);

    console.log(msg);
  }));

  return {
    updatedDaos,
    skippedDaos
  };
};

function _validateDaoPlugins(plugins) {
  const daoPlugins = {
    joinPlugin: null,
    fundingPlugin: null
  };

  for (const plugin of plugins) {
    if (plugin.coreState.name === PROPOSAL_TYPE.Join) {
      daoPlugins.joinPlugin = plugin;
    }
    if (plugin.coreState.name === PROPOSAL_TYPE.FundingRequest) {
      daoPlugins.fundingPlugin = plugin;
    }
  }

  if (!daoPlugins.joinPlugin || !daoPlugins.fundingPlugin) {
    const msg = `Skipping dao as it is not properly configured - missing the required plugins`;

    return { isValid: false, errorMsg: msg };
  }

  return { isValid: true, plugins: daoPlugins };

}

function _validateDaoState(daoState) {

  if (!daoState.metadata) {
    return { isValid: false, errorMsg: `Skipping this dao ${daoState.name} - ${daoState.id}  as it has no metadata` };
  }
  const metadata = JSON.parse(daoState.metadata);
  const daoVersion = metadata.VERSION;
  if (!daoVersion) {
    return {
      isValid: false,
      errorMsg: `Skipping this dao ${daoState.name} - ${daoState.id} as it has no metadata.VERSION`
    };
  }
  if (daoVersion < ipfsDataVersion) {
    return {
      isValid: false,
      errorMsg: `Skipping this dao ${daoState.name} - ${daoState.id} as has an unsupported version ${daoVersion} (should be >= ${ipfsDataVersion})`
    };
  }

  return { isValid: true };
}

const _getDaoPlugins = async (dao, { blockNumber, customRetryOptions }) => {
  let plugins = null;
  const daoPluginsQuery = {};
  if (blockNumber) {
    daoPluginsQuery.block = { number: blockNumber }
    plugins = await promiseRetry(
      async (retryFunc, number) => {
        console.log(`Try #${number} get dao plugins for graph block with number ${blockNumber}`);
        try {
          plugins = await dao.plugins(daoPluginsQuery).first();
        } catch (err) {
          if (err.message.includes('has only indexed up to block number')) {
            retryFunc(`The current graph block "${blockNumber}" is still not indexed.`);
          } else {
            throw err;
          }
        }

        return plugins;
      },
      { ...retryOptions, ...customRetryOptions }
    );
  } else {
    plugins = await dao.plugins(daoPluginsQuery, { fetchPolicy: 'no-cache' }).first();
  }
  return plugins;
}

async function _updateDaoDb(dao, blockNumberInfo) {

  const daoState = dao.coreState;

  // Validate Dao state
  const validation = _validateDaoState(daoState);
  if (!validation.isValid) {
    console.log(`Dao state validation failed for id: ${dao.id}!`);
    return { errorMsg: validation.errorMsg };
  }

  // Validate plugins
  const plugins = await _getDaoPlugins(dao, blockNumberInfo);
  const pluginValidation = _validateDaoPlugins(plugins);

  if (!pluginValidation.isValid) {
    console.log(`Dao plugins validation failed for id: ${dao.id}!`);
    return { errorMsg: pluginValidation.errorMsg };
  }

  const { joinPlugin, fundingPlugin } = pluginValidation.plugins;

  console.log(`UPDATING dao ${daoState.name} ...`);
  const {
    // fundingGoal, // We ignore the "official" funding gaol, instead we use the one from the metadata field
    minFeeToJoin,
    memberReputation
  } = joinPlugin.coreState.pluginParams;

  const metadata = JSON.parse(daoState.metadata);
  const fundingGoal = Number(metadata.fundingGoal);
  const { activationTime } = fundingPlugin.coreState.pluginParams.voteParams;

  // also get the balance
  const balance = await getBalance(dao.id);

  const doc = {
    id: dao.id,
    address: daoState.address,
    balance,
    memberCount: daoState.memberCount,
    name: daoState.name,
    numberOfBoostedProposals: daoState.numberOfBoostedProposals,
    numberOfPreBoostedProposals: daoState.numberOfPreBoostedProposals,
    numberOfQueuedProposals: daoState.numberOfQueuedProposals,
    register: daoState.register,
    // reputationId: reputation.id,
    reputationTotalSupply: parseInt(daoState.reputationTotalSupply),
    fundingGoal: fundingGoal,
    fundingGoalDeadline: activationTime,
    minFeeToJoin: minFeeToJoin.toNumber(),
    memberReputation: memberReputation.toNumber(),
    metadata,
    metadataHash: daoState.metadataHash
  };

  // also update the member information if it has changed
  const existingDoc = await getDaoById(dao.id);


  const existingDocData = existingDoc.data();
  if (!existingDocData || !existingDocData.members || existingDocData.members.length !== daoState.memberCount) {
    console.log(`Membercount changed, updating member collections`);
    const members = await dao.members().first();
    doc.members = [];
    for (const member of members) {
      // eslint-disable-next-line
      const user = await findUserByAddress(member.coreState.address);
      if (user === null) {
        console.log(`No user found with this address ${member.coreState.address}`);
        doc.members.push({
          address: member.coreState.address,
          userId: null
        });
      } else {
        doc.members.push({
          address: member.coreState.address,
          userId: user.id
        });
      }
    }
  } else {
    doc.members = existingDocData.members
  }
  await updateDao(dao.id, doc);
  return { 
    updatedDoc: doc 
  };
}

async function updateDaoById(daoId, customRetryOptions = {}, blockNumber) {
  const arc = await getArc();
  if (!daoId) {
    throw new CommonError(`You must provide a daoId (current value is "${daoId}")`);
  }
  daoId = daoId.toLowerCase();

  const daoQuery = {
    where: {
      id: daoId
    }
  }

  const currBlockNumber = validateBlockNumber(blockNumber);

  if (currBlockNumber) {
    daoQuery.block = { number: currBlockNumber }
  }

  const res =  await promiseRetry(
    async (retryFunc, number) => {
      console.log(`Try #${number} to get Dao ${daoId}...`);
      let currDaosResult = null;
      try {
        currDaosResult = await arc.daos(daoQuery, { fetchPolicy: 'no-cache' } ).first();
      } catch (err) {
        if (err.message.includes('has only indexed up to block number')) {
          retryFunc(`The current graph block "${blockNumber}" is still not indexed.`);
        } else {
          throw err;
        }
      }

      if(number > 7) {
        console.warn('Cannot get dao after a lot of retries. Current result: ', currDaosResult);
      }

      if (currDaosResult.length === 0) {
        console.log(`retrying because we did not find a dao ${daoId}`)
        retryFunc(`We could not find a dao with id "${daoId}" in the graph at ${arc.graphqlHttpProvider}.`);
      }
      if (!currDaosResult[0].coreState.metadata) {
        console.log(`retrying because the dao ${daoId} has no metadata`)
        retryFunc(`The dao with id "${daoId}" has no metadata`);
      }

      const dao = currDaosResult[0];

      // @todo: _updateDaoDb should throw en error, not return error messages
      const { updatedDoc, errorMsg } = await _updateDaoDb(dao, { blockNumber: currBlockNumber, customRetryOptions });

      if (errorMsg) {
        console.log(`retrying because of error: ${errorMsg}`)
        retryFunc(errorMsg)
      }

      console.log('UPDATED DAO WITH ID: ', daoId);
      return updatedDoc;
    },
    { ...retryOptions, ...customRetryOptions }
  );

  return res;
}

module.exports = {
  updateDaos,
  updateDaoById
};
