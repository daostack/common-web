const { findUserByAddress } = require('../db/userDbService');
const { CommonError } = require('../util/errors');
const { Vote } = require('@daostack/arc.js');
const { getArc, retryOptions, ipfsDataVersion } = require('../settings')
const promiseRetry = require('promise-retry');
const { Utils } = require('../util/util');
const { UnsupportedVersionError } = require('../util/errors');
const { updateProposal } = require('../db/proposalDbService');
const BN = require('bn.js');
const { validateBlockNumber } = require('./util/util');

const parseVotes = (votesArr) => {
  return votesArr.map(({ coreState: { voter, outcome } }) => { return { voter, outcome } })
}

const _getVotes = async (arc, voteQuery, options) => {
  const { blockNumber, customRetryOptions } = options || {};

  let votes = null;
  if (blockNumber) {
    voteQuery.block = { number: blockNumber }
    votes = await promiseRetry(
      async (retryFunc, number) => {
        console.log(`Try #${number} find proposal votes for block with number ${blockNumber}`);
        try {
          votes = await Vote.search(arc, voteQuery).first();
        } catch (err) {
          if (err.message.includes('has only indexed up to block number')) {
            retryFunc(`The current graph block "${blockNumber}" is still not indexed.`);
          } else {
            throw err;
          }
        }

        return votes;
      },
      { ...retryOptions, ...customRetryOptions }
    );
  } else {
    console.log("voteQuery -> ", voteQuery);
    votes = await Vote.search(arc, voteQuery, { fetchPolicy: 'no-cache' }).first();
  }
  return votes;
}

async function _updateProposalDb(proposal, graphBlockInfo) {
  const arc = await getArc();
  const result = { updatedDoc: null, errorMsg: null };
  const s = proposal.coreState
  
  const voteQuery = {
    where: {
      proposal: s.id
    }
  }

  const votes = await _getVotes(arc, voteQuery, graphBlockInfo);
  
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
  
  const proposalDataVersion = proposalDescription.VERSION;
  
  if (proposalDataVersion < ipfsDataVersion) {
    throw new UnsupportedVersionError(`Skipping this proposal ${s.id} as it has an unsupported version ${proposalDataVersion} (should be >= ${ipfsDataVersion})`);
  }
  
  const thousand = new BN(1000);
  // @refactor
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
    votesFor: s.votesFor.div(thousand).toString(),
    votesAgainst: s.votesAgainst.div(thousand).toString(),
    id: s.id,
    name: s.name,
    preBoostedAt: s.preBoostedAt,
    proposer: s.proposer,
    proposerId,
    resolvedAt: s.resolvedAt,
    stage: s.stage,
    stageStr: s.stage.toString(),
    type: s.type,
    join: {
      proposedMemberAddress: s.proposedMember || null,
      proposedMemberId: proposedMemberId,
      funding: s.funding && s.funding.toString() || null,
      reputationMinted: s.reputationMinted && s.reputationMinted.toString() || null
    },
    fundingRequest: {
      beneficiary: s.beneficiary || null,
      proposedMemberId: proposedMemberId,
      amount: s.amount && s.amount.toString() || null,
      amountRedemeed: s.amountRedeemd && s.amountRedeemed.toString() || null,
    },
    votes: votes.length > 0 ? parseVotes(votes) : [],
    winningOutcome: s.winningOutcome,
  }
  
  //await db.collection('proposals').doc(s.id).set(doc, { merge: true })
  await updateProposal(s.id, doc);
  result.updatedDoc = doc;
  
  return result;
}

async function updateProposalById(proposalId, customRetryOptions = {}, blockNumber, currentTry = 0) {
  const arc = await getArc();
  let currBlockNumber = validateBlockNumber(blockNumber);
  
  const proposalQuery = {
    where: {
      id: proposalId
    }
  };

  if (currBlockNumber) {
    proposalQuery.block = { number: currBlockNumber }
  }
  
  let proposal = await promiseRetry(
    async (retryFunc, number) => {
      console.log(`Try #${number} to get proposal ${proposalId}`);
      let proposals = null;
      try {
        proposals = await arc.proposals(proposalQuery, !proposalQuery.block ? { fetchPolicy: 'no-cache' } : {} ).first();
      } catch (err) {
        if (err.message.includes('has only indexed up to block number')) {
          retryFunc(`The current graph block "${blockNumber}" is still not indexed.`);
        } else {
          throw err;
        }
      }
      
      if (proposals.length === 0) {
        await retryFunc(`We could not find a proposal with id "${proposalId}" in the graph.`);
      }
      // @notice The current implementation is a workaround a problem that actually needs to be solved
      else {
        const propState = proposals[0].coreState  
        if (propState.votes.length !== propState.votesCount) {
          // We want to log this error, as the graph people deny that this could happen and we need evidence :)
          console.error( 'Inconsistent data from the subgraph', new CommonError('Inconsistent data from the subgraph'));
          
          await retryFunc(`The data from the graph about the votes is not consistent: votesCount is ${propState.votesCount} but there are ${propState.votes.length} votes`);
        }
      }
      return proposals[0]
    },
    { ...retryOptions, ...customRetryOptions }
    );
    
    const updatedDoc = await _updateProposalDb(proposal, { blockNumber: currBlockNumber, customRetryOptions });
    
    console.log(`Updated proposal with id (${proposal.id})`);
    
    return updatedDoc;
  }
  
  async function updateProposals() {
    const arc = await getArc();
    const allProposals = [];
    let currProposals = null;
    let skip = 0;
    
    do {
      // eslint-disable-next-line no-await-in-loop
      currProposals = await arc.proposals({ first: 1000, skip: skip * 1000 }, { fetchPolicy: 'no-cache' }).first();
      allProposals.push(...currProposals);
      skip++;
    } while (currProposals && currProposals.length > 0);
    
    console.log(`found ${allProposals.length} proposals`)
    
    const updatedProposals = [];
    const skippedProposals = [];
    
    await Promise.all(allProposals.map(async proposal => {
      try {
        updatedProposals.push(await _updateProposalDb(proposal));
      } catch (e) {
        // if (e.code === 1 || e instanceof UnsupportedVersionError) {
          console.log(`Skipped ${proposal.id} due to old data version.`);
          
          skippedProposals.push({
            proposalId: proposal.id,
            skippedDueTo: e.message
          });
        // } else {
          // throw e;
        // }
      }
    }));
    
    return {
      updatedProposals,
      skippedProposals
    };
  }
  
  
  module.exports = {
    updateProposals,
    updateProposalById
  };
  