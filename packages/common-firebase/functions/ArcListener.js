const { Arc, Member } = require('@daostack/arc.js');
const admin = require('firebase-admin');
const { graphHttpLink, graphwsLink} = require('./settings')

const arc = new Arc({
  graphqlHttpProvider: graphHttpLink,
  graphqlWsProvider: graphwsLink,
});

const db = admin.firestore();

function error(msg) {
  console.error(msg)
}

async function findUserByAddress(ethereumAddress, key = 'safeAddress') {
  const query = db.collection(`users`)
    .where(key, `==`, ethereumAddress)
  
  const snapshot = await query.get()
  if (snapshot.size === 0) {

    // TODO: remove looking for a user by ethereuAddress code once we reset the database
    if (key === "safeAddress") {
      let memberFromEthereumAddress = await findUserByAddress(ethereumAddress, "ethereumAddress")
      if (memberFromEthereumAddress) {
        return memberFromEthereumAddress
      } 
    }
    error(`No member found with ${key} === ${ethereumAddress}`)
    return null
  } else {
    const member = snapshot.docs[0]
    return member
  }
}


// get all DAOs data from graphql and read it into the subgraph
async function updateDaos() {
  const response = []
  const daos = await arc.daos({},{fetchPolicy: 'no-cache'}).first()
  console.log(`found ${daos.length} DAOs`)
  
  for (const dao of daos) {
    const plugins = await dao.plugins().first()
    let joinAndQuitPlugin
    let fundingPlugin
    for (const plugin of plugins) {
      if (plugin.coreState.name === "JoinAndQuit") {
        joinAndQuitPlugin = plugin
      }
      if (plugin.coreState.name === "FundingRequest") {
        fundingPlugin = plugin
      }
    }
    if (!joinAndQuitPlugin || !fundingPlugin) {
      const msg = `Skipping ${dao.id} as it is not properly configured`;
      console.log(msg);
      response.push(msg)
      return
    }

    const daoState = dao.coreState
    console.log(`updating ${dao.id}: ${daoState.name}`);
    const {
      fundingGoal,
      minFeeToJoin,
      memberReputation,
    } = joinAndQuitPlugin.coreState.pluginParams;

    const { activationTime } = fundingPlugin.coreState.pluginParams.voteParams

    try {
      let metadata
      if (daoState.metadata) {
        try {
          metadata = JSON.parse(daoState.metadata)
        } catch(err) {
          metadata = {
            error: err.message
          }
          throw err
        }
      } else {
        metadata = {}
      }
      const doc = {
        id: dao.id,
        address: daoState.address,
        memberCount: daoState.memberCount,
        name: daoState.name,
        numberOfBoostedProposals: daoState.numberOfBoostedProposals,
        numberOfPreBoostedProposals: daoState.numberOfPreBoostedProposals,
        numberOfQueuedProposals: daoState.numberOfQueuedProposals,
        register: daoState.register,
        // reputationId: reputation.id,
        reputationTotalSupply: parseInt(daoState.reputationTotalSupply),
        fundingGoal: fundingGoal.toString(),
        fundingGoalDeadline: activationTime,
        minFeeToJoin: minFeeToJoin.toString(),
        memberReputation: memberReputation.toString(),
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
            console.log(`no user found with this address ${member.coreState.address}`)  
            doc.members.push({
              address: member.coreState.address,
              userId: null
            })
          } else {
            console.log(`user found with this address ${member.coreState.address}`)  
            console.log(user)
            const userDaos = user.daos || []
            if (!(dao.id in userDaos)) {
              userDaos.push(dao.id)
              db.collection("users").doc(user.id).update({ daos: userDaos})
            }
            doc.members.push({
              address: member.coreState.address,
              userId: user.id 
            })
          }
        }
      }
      
      if (existingDocData) {
        await db.collection('daos').doc(dao.id).update(doc)
      } else {
        await db.collection('daos').doc(dao.id).create(doc)
      }
      const msg =`Updated dao ${dao.id}`
      response.push(msg)
      console.log(msg)
    } catch(err) {
      console.log(err)
      throw err
    }
  }
  return response.join('\n')
}


async function updateProposals(first=null) {
  const db = admin.firestore();
  const proposals = await arc.proposals({first}, {fetchPolicy: 'no-cache'}).first()
  console.log(`found ${proposals.length} proposals`)
  
  const docs = []
  for (const proposal of proposals) {
    const s = proposal.coreState
    
    // TODO: for optimization, consider looking for a new member not as part of this update process
    // but as a separate cloudfunction instead (that watches for changes in the database and keeps it consistent)
    
    // try to find the memberId corresponding to this address
    const proposer = await findUserByAddress(s.proposer)
    const proposerId = proposer.id
    let proposedMemberId
    if (!s.proposedMember) {
      proposedMemberId = null
    } else if (s.proposer === s.proposedMember) {
      proposedMemberId = proposerId
    } else {
      const proposedMember = await findUserByAddress(s.proposedMember)
      proposedMemberId = proposedMember.id
    }
    
    const doc = {
      boostedAt: s.boostedAt,
      description: s.description,
      createdAt: s.createdAt,
      dao: s.dao.id,
      executionState: s.executionState,
      executed: s.executed,
      executedAt: s.executedAt,
      expiresInQueueAt: s.expiresInQueueAt,
      // TODO: votesFor and votesAgainst are in terms of reputation - we need to divide by 1000
      votesFor: parseInt(s.votesFor),
      votesAgainst: parseInt(s.votesAgainst),
      id: s.id,
      name: s.name,
      preBoostedAt: s.preBoostedAt,
      proposer: s.proposer,
      proposerId,
      resolvedAt: s.resolvedAt,
      stage: s.stage,
      stageStr: s.stage.toString(),
      title: s.title,
      type: s.type,
      joinAndQuit: {
        proposedMemberAddress: s.proposedMember,
        proposedMemberId: proposedMemberId,
        funding: s.funding.toString()
      },
      votes: s.votes,
      winningOutcome: s.winningOutcome,
      // TODO: get actual links and images (these can be found in JSON.parse(s.description))
      links: [{
        title: "website",
        url: s.url,
      }],
      images: [],
    }
    
    await db.collection('proposals').doc(s.id).set(doc)
    docs.push(doc)
  }
  return docs
}
async function updateUsers() {
  // this function is not used, leaving it here for reference
  const response = []
  const members = await Member.search(arc, {},{fetchPolicy: 'no-cache'}).first()
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
      await db.collection('users').doc(user.id).update(doc)
    }
  }
  return response.join('\n')
}


module.exports = {
  updateDaos,
  updateProposals,
  updateUsers
}
