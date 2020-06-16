const { Arc, Member, Vote } = require('../node_modules/@daostack/arc.js');
const admin = require('firebase-admin');
const { graphHttpLink, graphwsLink } = require('../settings')

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
  const response = []
  const daos = await arc.daos({}, { fetchPolicy: 'no-cache' }).first()
  console.log(`found ${daos.length} DAOs`)

  for (const dao of daos) {
    const daoState = dao.coreState
    if (!daoState.metadata) {
      console.log(`${dao.id} Skipping this dao ${dao.coreState.name}  as it has no metadata`)
      continue
    }
    const metadata = JSON.parse(daoState.metadata)
    const daoVersion = metadata.VERSION
    if (!daoVersion) {
      console.log(`${dao.id} Skipping this dao ${dao.coreState.name}  as it has no metadata.VERSION`)
      continue
    }
    if (daoVersion < "000001") {
      console.log(`${dao.id} Skipping this dao ${dao.coreState.name} as has an unsupported version ${daoVersion}`)
      continue
    }

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
      continue
    }

    console.log(`UPDATING ${dao.id}: ${daoState.name}`);
    const {
      // fundingGoal, // We ignore the "official" funding gaol, instead we use the one from the metadata field
      minFeeToJoin,
      memberReputation,
    } = joinAndQuitPlugin.coreState.pluginParams;

    const fundingGoal = Number(metadata.fundingGoal)
    const { activationTime } = fundingPlugin.coreState.pluginParams.voteParams

    try {
      const doc = {
        id: dao.id,
        address: daoState.address,
        balance: 0, // TODO: get the actual token balance here
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
              db.collection("users").doc(user.id).update({ daos: userDaos })
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


      const msg = `Updated dao ${dao.id}`
      response.push(msg)
      console.log(msg)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
  return response.join('\n')
}


async function updateProposals(first = null) {
  const db = admin.firestore();
  const proposals = await arc.proposals({ first }, { fetchPolicy: 'no-cache' }).first()
  console.log(`found ${proposals.length} proposals`)

  const docs = []
  for (const proposal of proposals) {
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

    console.log(s)
    
    const doc = {
      boostedAt: s.boostedAt,
      // TODO: get actual links and images (these can be found in JSON.parse(s.description))
      description: s.description,
      createdAt: s.createdAt,
      dao: s.dao.id,
      executionState: s.executionState,
      executed: s.executed,
      executedAt: s.executedAt,
      expiresInQueueAt: s.expiresInQueueAt,
      // TODO: votesFor and votesAgainst are in terms of reputation - we need to divide by 1000
      votesFor: s.votesFor.toNumber()/1000,
      votesAgainst: s.votesAgainst.toNumber()/1000,
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
      images: s.images || [],
      links: s.links || [],
      files: s.files || [],
    }

    await db.collection('proposals').doc(s.id).set(doc)
    docs.push(doc)
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
      await db.collection('users').doc(user.id).update(doc)
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
  updateProposals,
  updateUsers,
  updateVotes
}
