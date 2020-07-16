const functions = require('firebase-functions');
const { updateDaoById } = require('./ArcListener');

exports.watchForReputationRedeemed = functions.firestore
    .document('/proposals/{id}')
    .onUpdate(async (change) => {
        const data = change.after.data();
        const previousData = change.before.data();
        if (
          data.type === 'JoinAndQuit' &&
          previousData.joinAndQuit.reputationMinted === '0' &&
          data.joinAndQuit.reputationMinted !== '0'
        ) {
          console.log(
            'JoinAndQuit proposal reputationMinted changed from "0" Initiating DAO update'
          );
          try {
            await updateDaoById(data.dao);
          } catch (e) {
            console.log(e);
          }
        } 
    });
