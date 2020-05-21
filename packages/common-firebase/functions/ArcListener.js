const { Arc } = require('@daostack/arc.js');
const admin = require('firebase-admin');

const graphHttpLink = 'https://api.thegraph.com/subgraphs/name/daostack/v8_1_exp_xdai'
const graphwsLink = 'wss://api.thegraph.com/subgraphs/name/daostack/v8_1_exp_xdai'

const arc = new Arc({
  graphqlHttpProvider: graphHttpLink,
  graphqlWsProvider: graphwsLink,
});

const db = admin.firestore();

// get all DAOs data from graphql and read it into the subgraph
async function updateDaos() {
  const response = [];
  const daos = await arc.daos().first();
  console.log(`Found ${daos.length} DAOs`);
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

async function updateProposals() {
  arc.proposals({}, {subscribe: true, fetchAllData: true})
    .subscribe(async proposals => {
      proposals.map(async proposal => {
        const {coreState} = proposal;
        const proposalObject = {

          boostedAt: coreState.boostedAt,
          createdAt: coreState.createdAt,
          dao: coreState.dao.id,
          description: coreState.description,
          expiresInQueueAt: coreState.expiresInQueueAt,
          executionState: coreState.executionState,
          executed: coreState.executed,
          funding: coreState.funding.toString(),
          executedAt: coreState.executedAt,
          joinAndQuit: {
            funding: coreState.funding.toString(),
            proposedMemberId: coreState.proposer,
            proposedMemberAddress: coreState.proposer,
          },
          preBoostedAt: coreState.preBoostedAt,
          id: coreState.id,
          name: coreState.name,
          proposer: coreState.proposer,
          proposerId: coreState.proposer,
          resolvedAt: coreState.resolvedAt,
          stage: coreState.stage,
          title: coreState.title,
          type: coreState.type,
          votes: {
            list: coreState.votes,
            votesAgainst: parseInt(coreState.votesAgainst),
            votesFor: parseInt(coreState.votesFor),
          },
          links: [{
            title: "website",
            url: coreState.url,
          }],
          images: [],
          winningOutcome: coreState.winningOutcome,
        }
        await db.collection('proposals').doc(coreState.id).set(proposalObject)
      });

    })
}

// function updateDaosSubscription() {
//   //loop that runs a function every 15 seconds for 3 intervals
//   const response = ['xxx']
//   try {
//     const db = admin.firestore();
//     arc
//       .daos({}, {subscribe: true, fetchAllData: true})
//       .subscribe(res => {
//         res.map(async (dao, i) => {
//           // const state = await dao.fetchState()
//           // console.log(state)
//           const {id, address ,
//             memberCount,
//             name,
//             numberOfBoostedProposals ,
//             numberOfPreBoostedProposals ,
//             numberOfQueuedProposals ,
//             register,
//             reputation,
//             reputationTotalSupply,
//           } = dao.coreState;
//           // if (!dao.coreState.name.includes('Test DAO') && !dao.coreState.name.includes('Car DAO')) {
//           if (true) {
//             const joinAndQuitPlugins = await dao.plugins({where: {name: 'JoinAndQuit'}}).first()
//             if (joinAndQuitPlugins.length == 0) {
//               // we'll delete this DAO, as it does not have the correct plugins
//               try {
//                 console.log('DELETING: ', id)
//                 response.append(`Deleted dao ${id}`)
//                 await db.collection('daos').doc(id).delete();
//               } catch (e) {
//                 console.error('Failed to updated DAOs: ', error);
//               }
//             } else {
//               console.log('JaQ PLUGINS: ', joinAndQuitPlugins);
//               const joinAndQuitPlugin = joinAndQuitPlugins[0]
//               const {
//                 fundingGoal,
//                 minFeeToJoin,
//                 memberReputation
//               } = joinAndQuitPlugin.coreState.pluginParams;
//               try {
//                 await db.collection('daos').doc(id).set({
//                   id,
//                   address,
//                   memberCount,
//                   name,
//                   numberOfBoostedProposals,
//                   numberOfPreBoostedProposals,
//                   numberOfQueuedProposals,
//                   register,
//                   reputationId: reputation.id,
//                   reputationTotalSupply: parseInt(reputationTotalSupply),
//                   fundingGoal: fundingGoal.toString(),
//                   minFeeToJoin: minFeeToJoin.toString(),
//                   memberReputation: memberReputation.toString()
//                 })
//                 console.log(`[ Updated DAO ${name}@${address}] `);
//                 response.append(`updated DAO ${name}@${id}`)
//               } catch (error) {
//                 console.error(msg)
//                 const msg = `Failed to updated DAOs: ${error}`;
//                 throw Error(msg)
//               }
//             }
//           }
//           // if (dao.coreState.name.includes('Test DAO') || dao.coreState.name.includes('Car DAO')) {
//           //   console.log('DELETING: ', id)
//           //   await db.collection('daos').doc(id).delete();
//           // }
//         })
//       });
//   } catch(e) {
//     console.log('Error querying DAOs: ', e)
//     throw(e)
//   }
//   return '\n'.join(response)
// }

module.exports = {
  updateDaos,
  updatePlugins,
  updateProposals
}
