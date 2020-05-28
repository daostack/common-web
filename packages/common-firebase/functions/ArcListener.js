const { Arc, Member } = require('@daostack/arc.js');
const admin = require('firebase-admin');

const graphHttpLink = 'https://api.thegraph.com/subgraphs/name/daostack/v8_1_exp_xdai'
const graphwsLink = 'wss://api.thegraph.com/subgraphs/name/daostack/v8_1_exp_xdai'

const arc = new Arc({
  graphqlHttpProvider: graphHttpLink,
  graphqlWsProvider: graphwsLink,
});

const db = admin.firestore();

function error(msg) {
  console.error(msg)
}

async function test() {
  const query = db.collection(`users`)
    .where(`ethereumAddress`, `==`, `0x12a525B5A23626CAf20062DeD7C280358bB27e05`)
  // console.log(await query.listDocuments())
  const snapshot = await query.get()
  snapshot.forEach((doc) => { console.log(doc)})
  return 'ok'
}


async function findUserByEthereumAddress(ethereumAddress) {
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
      return member
    }
}


// get all DAOs data from graphql and read it into the subgraph
async function updateDaos() {
  const response = []
  const daos = await arc.daos({},{fetchPolicy: 'no-cache'}).first()
  console.log(`found ${daos.length} DAOs`)

  for (const dao of daos) {
    const joinAndQuitPlugins = await dao.plugins({where: {name: 'JoinAndQuit'}}).first();
    if (joinAndQuitPlugins.length === 0) {
      // not a properly configured common DAO, skipping
      const msg = `Skipping ${dao.id} as it is not properly configured`;
      console.log(msg);
      response.push(msg)
    } else {
       const daoState = dao.coreState
      console.log(`updating ${dao.id}: ${daoState.name}`);
      const joinAndQuitPlugin = joinAndQuitPlugins[0];
      const {
        fundingGoal,
        minFeeToJoin,
        memberReputation,
        fundingGoalDeadline
      } = joinAndQuitPlugin.coreState.pluginParams;
      try {
        let metadata
        console.log(daoState.metadata)
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
          fundingGoalDeadline: fundingGoalDeadline,
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
            const user = await findUserByEthereumAddress(member.coreState.address)
            if (user === null) {
              console.log(`no user found with this address ${member.coreState.address}`)  
              doc.members.push({
                address: member.coreState.address,
                userId: null
              })
            } else {
              console.log(`user found with this address ${member.coreState.adress}`)  
              const userDaos = user.daos || []
              if (!(dao.id in userDaos)) {
                userDaos.push(dao.id)
                db.collection("users").doc(user.id).update({ daos: userDaos})
              }
              console.log(user.id)
              doc.members.push({
                address: member.coreState.address,
                userId: user.id 
              })
              console.log(doc.members)
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
  }
  return response.join('\n')
}


 async function updateProposals(first=null) {
  const db = admin.firestore();
  const proposals = await arc.proposals({first}, {fetchPolicy: 'no-cache'}).first()
  console.log(`found ${proposals.length} proposals`)

  for (const proposal of proposals) {
    const s = proposal.coreState
    console.log(s)

    // TODO: for optimization, consider looking for a new member not as part of this update process
    // but as a separate cloudfunction instead (that watches for changes in the database and keeps it consistent)

    // try to find the memberId corresponding to this address
    const proposer = await findUserByEthereumAddress(db, s.proposer)
    const proposerId = proposer.id
    let proposedMemberId
    if (!s.proposedMember) {
      proposedMemberId = null
    } else if (s.proposer === s.proposedMember) {
      proposedMemberId = proposerId
    } else {
      const proposedMember = await findUserByEthereumAddress(db, s.proposedMember)
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
  console.log(mapMembersToDaos)
  for (const memberAddress of Object.keys(mapMembersToDaos)) {
    // find the member with this address
    const user = await findUserByEthereumAddress(memberAddress)
    if (user) {
      console.log(user)
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
  updateUsers,
  test
}
