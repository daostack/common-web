const { Member, Vote } = require('@daostack/arc.js');
const promiseRetry = require('promise-retry');
const admin = require('firebase-admin');
const { arc, retryOptions} = require('../settings')
const { getBalance } = require("./updateDAOBalance.js")

const db = admin.firestore()

function error(msg) {
  console.error(msg)
}

async function findUserByAddress(ethereumAddress, key = 'safeAddress') {
  const query = db.collection(`users`)
    .where(key, `==`, ethereumAddress)

  const snapshot = await query.get()
  if (snapshot.size === 0) {
    error(`No member found with ${key} === ${ethereumAddress}`)
    return null
  } else {
    const member = snapshot.docs[0]
    return member
  }
}

const parseVotes = (votesArr) => {
  return votesArr.map(item => item.id)
}


// get all DAOs data from graphql and read it into the subgraph
async function updateDaos() {
  console.log("UPDATE DAOS:");
  console.log("----------------------------------------------------------");

  const response = []
  const daos = await arc.daos({}, { fetchPolicy: 'no-cache' }).first()
  console.log(`found ${daos.length} DAOs`)

  for (const dao of daos) {
    console.log(`UPDATE DAO WITH ID: ${dao.id}`);
    const { errorMsg }  = await _updateDaoDb(dao);
    
    // TODO: this is not the way to handle errors
    if (errorMsg) {
      response.push(errorMsg);
      console.log(errorMsg);
      console.log("----------------------------------------------------------");
      continue;
    }

    const msg = `Updated dao ${dao.id}`
    response.push(msg)
    console.log(msg)
    console.log("----------------------------------------------------------");
  }
  return response.join('\n')
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
    
    return { isValid: false, errorMsg: msg};
  }

  return { isValid: true, plugins: daoPlugins};
  
}

function _validateDaoState(daoState) {
  
  if (!daoState.metadata) {
    return { isValid: false, errorMsg: `Skipping this dao ${daoState.name}  as it has no metadata`};
  }
  const metadata = JSON.parse(daoState.metadata)
  const daoVersion = metadata.VERSION
  if (!daoVersion) {
    return { isValid: false, errorMsg: `Skipping this dao ${daoState.name}  as it has no metadata.VERSION`};
  }
  if (daoVersion < "000001") {
    return { isValid: false, errorMsg: `Skipping this dao ${daoState.name} as has an unsupported version ${daoVersion}`};
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
    const existingDoc = await db.collection("daos").doc(dao.id).get()
    const existingDocData = existingDoc.data()
    if (!existingDocData || !existingDocData.members || existingDocData.members.length !== daoState.memberCount) {
      console.log(`Membercount changed, updating member collections`)
      const members = await dao.members().first()
      doc.members = []
      for (const member of members) {
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
    await db.collection('daos').doc(dao.id).set(doc, {merge: true})
    return { updatedDoc: doc };

    
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function updateDaoById(daoId, customRetryOptions = {} ) {

  if (!daoId) {
    throw Error(`You must provide a daoId (current value is "${daoId}")`)
  }
  daoId = daoId.toLowerCase()
  const dao = await promiseRetry(
    async function (retryFunc, number) {
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
  const { updatedDoc, errorMsg }  = await _updateDaoDb(dao);
  if (errorMsg) {
    console.log(`Dao update failed for id: ${dao.id}!`);
    console.log(errorMsg);
    throw Error(errorMsg);
  }
  console.log("UPDATED DAO WITH ID: ", daoId);
  console.log("----------------------------------------------------------");
  return updatedDoc;
}

async function _updateProposalDb(proposal) {

  const result = { updatedDoc: null, errorMsg: null }; 
  
    const s = proposal.coreState

    // TODO: for optimization, consider looking for a new member not as part of this update process
    // but as a separate cloudfunction instead (that watches for changes in the database and keeps it consistent)

    // try to find the memberId corresponding to this address
    const proposer = await findUserByAddress(s.proposer)
    const proposerId = proposer && proposer.id
    let proposedMemberId
    if (!s.proposedMember) {
      proposedMemberId = null
    } else if (s.proposer === s.proposedMember) {
      proposedMemberId = proposerId
    } else {
      const proposedMember = await findUserByAddress(s.proposedMember)
      proposedMemberId = proposedMember.id
    }

    // TO-BE-REMOVED: That should be deleted once we reset the data again.
    // It's needed because right now we have description property of type string which could be a jsoon or just a description of a proposal.
    let proposalDescription = null;
    try {
      proposalDescription = JSON.parse(s.description);
    } catch (error) {
      proposalDescription = {
        description: s.description,
        title: s.title
      };
    }

    const doc = {
      boostedAt: s.boostedAt,
      description: proposalDescription,
      closingAt: s.closingAt,
      createdAt: s.createdAt,
      dao: s.dao.id,
      executionState: s.executionState,
      executed: s.executed,
      executedAt: s.executedAt,
      expiresInQueueAt: s.expiresInQueueAt,
      votesFor: s.votesFor.toNumber() / 1000,
      votesAgainst: s.votesAgainst.toNumber() / 1000,
      id: s.id,
      name: s.name,
      preBoostedAt: s.preBoostedAt,
      proposer: s.proposer,
      proposerId,
      resolvedAt: s.resolvedAt,
      stage: s.stage,
      stageStr: s.stage.toString(),
      type: s.type,
      joinAndQuit: {
        proposedMemberAddress: s.proposedMember || null,
        proposedMemberId: proposedMemberId,
        funding: s.funding && s.funding.toString() || null
      },
      fundingRequest: {
        beneficiary: s.beneficiary || null,
        proposedMemberId: proposedMemberId,
        amount: s.amount && s.amount.toString() || null,
        amountRedemeed: s.amountRedeemd && s.amountRedeemed.toString() || null,
      },
      votes: parseVotes(s.votes),
      winningOutcome: s.winningOutcome,
    }

  await db.collection('proposals').doc(s.id).set(doc, {merge: true})
  result.updatedDoc = doc;

  return result;
}

async function updateProposalById(proposalId, customRetryOptions = {}) {
  let proposal = await promiseRetry(
    async function (retryFunc, number) {
      console.log(`Try #${number} to get Proposal...`);
      let currProposalResult = null;
      try {
        currProposalResult = await arc.proposal({ where: { id: proposalId } }, { fetchPolicy: 'no-cache' })
      } catch (err) {
        if (err.message.match(/Could not find a unique proposal satisfying these options/)) {
          retryFunc(`We could not find a proposal with id "${proposalId}" in the graph.`);
        }
        console.log(err)
        throw err
      }
      return currProposalResult;
    },
    {...retryOptions, ...customRetryOptions}
  );

  const { updatedDoc, errorMsg } = await _updateProposalDb(proposal);
  
  if (errorMsg) {
    console.log(`Proposal update failed for id: ${proposalId}!`);
    console.log(errorMsg);
    throw Error(errorMsg) 
  }
  
  console.log("UPDATED PROPOSAL: ", proposal);
  return updatedDoc;
}

async function updateProposals() {
  // TOOD: this function will be useless once we have > 1000 proposals!
  // take first: 1000  (this is the maximum, the default is 100)
  const proposals = await arc.proposals({ first: 1000 }, { fetchPolicy: 'no-cache' }).first()
  console.log(`found ${proposals.length} proposals`)

  const docs = []
  for (const proposal of proposals) {
    const updatedDoc = await _updateProposalDb(proposal);
    docs.push(updatedDoc)
  }
  return docs
}

async function updateUsers() {
  // this function is not used, leaving it here for reference
  const response = []
  const members = await Member.search(arc, {}, { fetchPolicy: 'no-cache' }).first()
  console.log(`found ${members.length} members`)
  const mapMembersToDaos = {}
  for (const member of members) {
    const daos = mapMembersToDaos[member.coreState.address] || []
    daos.push(member.coreState.dao.id)
    mapMembersToDaos[member.coreState.address] = daos
  }
  for (const memberAddress of Object.keys(mapMembersToDaos)) {
    // find the member with this address
    const user = await findUserByAddress(memberAddress)
    if (user) {
      const doc = {
        daos: mapMembersToDaos[memberAddress]
      }
      await db.collection('users').doc(user.id).set(doc, { merge: true})
    }
  }
  return response.join('\n')
  
}

async function updateVotes() {

  const db = admin.firestore();
  const votes = await Vote.search(arc, {}, { fetchPolicy: 'no-cache' }).first()
  console.log(`found ${votes.length} votes`)
  
  const docs = []
  for (const vote of votes) {

    const user = await findUserByAddress(vote.voter)
    const voteUserId = user ? user.id : null;
    
    const doc = {
      id: vote.id,
      voterAddress: vote.voter,
      voterUserId: voteUserId,
      proposalId: vote.proposal.id,

    }
    await db.collection('votes').doc(vote.id).set(doc)
    docs.push(doc)
    
  }
  return docs;
}


module.exports = {
  updateDaos,
  updateDaoById,
  updateProposals,
  updateProposalById,
  updateUsers,
  updateVotes
}
