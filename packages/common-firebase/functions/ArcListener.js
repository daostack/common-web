const { Arc } = require('@daostack/arc.js');
const admin = require('firebase-admin');

const graphHttpLink = 'https://api.thegraph.com/subgraphs/name/daostack/v8_1_exp_xdai'
const graphwsLink = 'wss://api.thegraph.com/subgraphs/name/daostack/v8_1_exp_xdai'

const arc = new Arc({
  graphqlHttpProvider: graphHttpLink,
  graphqlWsProvider: graphwsLink,
});

function error(msg) {
  console.error(msg)
}

async function test() {
  const db = admin.firestore();
  const query = db.collection(`users`)
    .where(`ethereumAddress`, `==`, `0x12a525B5A23626CAf20062DeD7C280358bB27e05`)
  // console.log(await query.listDocuments())
  const snapshot = await query.get()
  console.log(snapshot.size)
  console.log(snapshot.docs)
  snapshot.forEach((doc) => { console.log(doc)})
  return 'ok'
}


async function findUserByEthereumAddress(db, ethereumAddress) {
    // const query = await admin.database().ref(`users`)
    const query = db.collection(`users`)
      .where(`ethereumAddress`, `==`, ethereumAddress)

    const snapshot = await query.get()
    if (snapshot.size === 0) {
      // we hae an ethereum address but no registered user: this is unexpected but not impossibl
      error(`No member found with ethereumAddress === ${ethereumAddress} `)
      return null
    } else {
      const member = snapshot.docs[0]
      return member.id
    }
}

const db = admin.firestore();

// get all DAOs data from graphql and read it into the subgraph
async function updateDaos() {
  const response = []
  const daos = await arc.daos().first()
  console.log(`found ${daos.length} DAOs`)

  for (const dao of daos) {
    const joinAndQuitPlugins = await dao.plugins({where: {name: 'JoinAndQuit'}}).first();
    if (joinAndQuitPlugins.length === 0) {
      // not a properly configured common DAO, skipping
      const msg = `Skipping ${dao.id} as it is not properly configured`;
      console.log(msg);
      response.push(msg)
    } else {
      console.log(`updating ${dao.id}`);
      const joinAndQuitPlugin = joinAndQuitPlugins[0];
      const {
        fundingGoal,
        minFeeToJoin,
        memberReputation
      } = joinAndQuitPlugin.coreState.pluginParams;
      try {
      const daoState = dao.coreState
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
        minFeeToJoin: minFeeToJoin.toString(),
        memberReputation: memberReputation.toString()
      }
      await db.collection('daos').doc(dao.id).set(doc)
      const msg =`Updated dao ${dao.id}`
      response.push(msg)
      console.log(msg)
    } catch(err) {
      console.log(err)
      throw err
    }
    }
  }
  return response.join('\n')
}


async function updatePlugins() {

}

async function updateProposals(first=null) {
  const db = admin.firestore();
  const proposals = await arc.proposals({first}).first()
  console.log(`found ${proposals.length} proposals`)

  for (const proposal of proposals) {
    const s = proposal.coreState
    console.log(s)

    // TODO: for optimization, consider looking for a new member not as part of this update process
    // but as a separate cloudfunction instead (that watches for changes in the database and keeps it consistent)

    // try to find the memberId corresponding to this address
    const proposerId = await findUserByEthereumAddress(db, s.proposer)
    let proposedMemberId
    if (!s.proposedMember) {
      proposedMemberId = null
    } else if (s.proposer === s.proposedMember) {
      proposedMemberId = proposerId
    } else {
      proposedMemberId = await findUserByEthereumAddress(db, s.proposedMember)
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
    return doc
  }
}

module.exports = {
  updateDaos,
  updatePlugins,
  updateProposals,
  test
}
