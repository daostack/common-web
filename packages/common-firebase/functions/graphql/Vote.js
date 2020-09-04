const { findUserByAddress } = require('../db/userDbService');
const { Vote } = require('@daostack/arc.js');
const { arc } = require('../settings')
const { updateVote } = require('../db/voteDbService');

async function updateVotes() {

  const allVotes = [];
  let currVotes = null;
  let skip = 0;

  const docs = [];
  
  do {
    // eslint-disable-next-line no-await-in-loop
    currVotes = await Vote.search(arc, { first: 1000, skip: skip * 1000 }, { fetchPolicy: 'no-cache' }).first();
    allVotes.push(...currVotes);
    skip++;
  } while (currVotes && currVotes.length > 0);

  console.log(`found ${allVotes.length} votes`)
  
  await Promise.all(
    allVotes.map(async vote => {
      const user = await findUserByAddress(vote.coreState.voter);
      const voteUserId = user
        ? user.id
        : null;

      const doc = {
        id: vote.id,
        voterAddress: vote.coreState.voter,
        voterUserId: voteUserId,
        proposalId: vote.coreState.proposal.id,
      }

      await updateVote(vote.id, doc);

      docs.push(doc);
    }));
  
  return docs;
}

module.exports = {
    updateVotes
}
