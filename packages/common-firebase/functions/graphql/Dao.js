const { findUserByAddress } = require('../db/userDbService');
const { arc, retryOptions, ipfsDataVersion } = require('../settings')
const { getBalance } = require("../db/daoDbService")
const promiseRetry = require('promise-retry');

const { updateDao, getDaoById } = require('../db/daoDbService');

// get all DAOs data from graphql and read it into the subgraph
const updateDaos = async () => {
    console.log("UPDATE DAOS:");
    console.log("----------------------------------------------------------");

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
            console.error(errorMsg);

            return;
        }

        const msg = `Updated dao ${dao.id}`;
        updatedDaos.push(msg);

        console.log(msg);
        console.log("----------------------------------------------------------");
    }));

    return {
        updatedDaos,
        skippedDaos
    };
}

function _validateDaoPlugins(plugins) {
    const daoPlugins = {
        joinAndQuitPlugin: null,
        fundingPlugin: null,
    }
    for (const plugin of plugins) {
        if (plugin.coreState.name === "JoinAndQuit") {
            daoPlugins.joinAndQuitPlugin = plugin
        }
        if (plugin.coreState.name === "FundingRequest") {
            daoPlugins.fundingPlugin = plugin
        }
    }
    if (!daoPlugins.joinAndQuitPlugin || !daoPlugins.fundingPlugin) {
        const msg = `Skipping dao as it is not properly configured`;

        return { isValid: false, errorMsg: msg };
    }

    return { isValid: true, plugins: daoPlugins };

}

function _validateDaoState(daoState) {

    if (!daoState.metadata) {
        return { isValid: false, errorMsg: `Skipping this dao ${daoState.name} - ${daoState.id}  as it has no metadata` };
    }
    const metadata = JSON.parse(daoState.metadata)
    const daoVersion = metadata.VERSION
    if (!daoVersion) {
        return { isValid: false, errorMsg: `Skipping this dao ${daoState.name} - ${daoState.id} as it has no metadata.VERSION` };
    }
    if (daoVersion < ipfsDataVersion) {
        return { isValid: false, errorMsg: `Skipping this dao ${daoState.name} - ${daoState.id} as has an unsupported version ${daoVersion} (should be >= ${ipfsDataVersion})` };
    }

    return { isValid: true };
}

async function _updateDaoDb(dao) {

    const daoState = dao.coreState

    // Validate Dao state
    const validation = _validateDaoState(daoState);
    if (!validation.isValid) {
        console.log(`Dao state validation failed for id: ${dao.id}!`);
        return { errorMsg: validation.errorMsg };
    }

    // Validate plugins
    const plugins = await dao.plugins().first()
    const pluginValidation = _validateDaoPlugins(plugins);

    if (!pluginValidation.isValid) {
        console.log(`Dao plugins validation failed for id: ${dao.id}!`);
        return { errorMsg: pluginValidation.errorMsg };
    }

    const { joinAndQuitPlugin, fundingPlugin } = pluginValidation.plugins;

    console.log(`UPDATING dao ${daoState.name} ...`);
    const {
        // fundingGoal, // We ignore the "official" funding gaol, instead we use the one from the metadata field
        minFeeToJoin,
        memberReputation,
    } = joinAndQuitPlugin.coreState.pluginParams;

    const metadata = JSON.parse(daoState.metadata)
    const fundingGoal = Number(metadata.fundingGoal)
    const { activationTime } = fundingPlugin.coreState.pluginParams.voteParams

    // also get the balance
    const balance = await getBalance(dao.id)
    try {
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
        }

        // also update the member information if it has changed
        const existingDoc = await getDaoById(dao.id);

        
        const existingDocData = existingDoc.data()
        if (!existingDocData || !existingDocData.members || existingDocData.members.length !== daoState.memberCount) {
            console.log(`Membercount changed, updating member collections`)
            const members = await dao.members().first()
            doc.members = []
            for (const member of members) {
                // eslint-disable-next-line
                const user = await findUserByAddress(member.coreState.address)
                if (user === null) {
                    console.log(`No user found with this address ${member.coreState.address}`)
                    doc.members.push({
                        address: member.coreState.address,
                        userId: null
                    })
                } else {
                    console.log(`User found with this address ${member.coreState.address}`)
                    // const userDaos = user.daos || []
                    // if (!(dao.id in userDaos)) {
                    //   userDaos.push(dao.id)
                    //   db.collection("users").doc(user.id).update({ daos: userDaos })
                    // }
                    doc.members.push({
                        address: member.coreState.address,
                        userId: user.id
                    })
                }
            }
        }
        await updateDao(dao.id, doc);
        return { updatedDoc: doc };


    } catch (err) {
        console.error(err)
        throw err
    }
}

async function updateDaoById(daoId, customRetryOptions = {}) {

    if (!daoId) {
        throw Error(`You must provide a daoId (current value is "${daoId}")`)
    }
    daoId = daoId.toLowerCase()
    const dao = await promiseRetry(
        async (retryFunc, number) => {
            console.log(`Try #${number} to get Dao...`);
            const currDaosResult = await arc.daos({ where: { id: daoId } }, { fetchPolicy: 'no-cache' }).first();

            if (currDaosResult.length === 0) {
                retryFunc(`We could not find a dao with id "${daoId}" in the graph.`);
            }
            if (!currDaosResult[0].coreState.metadata) {
                retryFunc(`The dao with id "${daoId}" has no metadata`);
            }
            return currDaosResult[0];
        },
        {...retryOptions, ...customRetryOptions }
    );

    // TODO: _updateDaoDb should throw en error, not ereturn error messages
    const { updatedDoc, errorMsg } = await _updateDaoDb(dao);
    if (errorMsg) {
        console.error(`Dao update failed for id: ${dao.id}!`);
        console.error(errorMsg);
        throw Error(errorMsg);
    }
    console.log("UPDATED DAO WITH ID: ", daoId);
    console.log("----------------------------------------------------------");
    return updatedDoc;
}

module.exports = {
    updateDaos,
    updateDaoById
};
