const { findUserByAddress } = require('../db/userDbService');
const { Vote } = require('@daostack/arc.js');
const { arc } = require('../settings')
const { updateVote } = require('../db/voteDbService');

async function updateVotes() {

    const votes = await Vote.search(arc, {}, { fetchPolicy: 'no-cache' }).first()
    console.log(`found ${votes.length} votes`)


    const docs = []
    await Promise.all(
      votes.map(async vote =>  {
        const user = await findUserByAddress(vote.voter);

        const voteUserId = user
          ? user.id
          : null;

        const doc = {
            id: vote.id,
            voterAddress: vote.voter,
            voterUserId: voteUserId,
            proposalId: vote.proposal.id,

        }

        await updateVote(vote.id, doc);

        docs.push(doc);
    }));

    return docs;
}

module.exports = {
    updateVotes
}
