const { findUserByAddress } = require('../db/userDbService');
const { Vote } = require('@daostack/arc.js');
const { arc, retryOptions, ipfsDataVersion } = require('../settings')
const promiseRetry = require('promise-retry');
const { Utils } = require('../util/util');
const { UnsupportedVersionError } = require('../util/error');
const { updateProposal } = require('../db/proposalDbService');
const BN = require('bn.js');

const parseVotes = (votesArr) => {
    return votesArr.map(({ coreState: { voter, outcome } }) => { return { voter, outcome } })
}

async function _updateProposalDb(proposal) {
    const result = { updatedDoc: null, errorMsg: null };
    const s = proposal.coreState

    const votes = await Vote.search(arc, { where: { proposal: s.id } }, { fetchPolicy: 'no-cache' }).first();

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

async function updateProposalById(proposalId, customRetryOptions = {}, blockNumber) {
    let currBlockNumber = null;
    if (blockNumber) {
        currBlockNumber = Number(blockNumber);
        if (Number.isNaN(currBlockNumber)) {
            throw Error(`The blockNumber parameter should be a number between 0 and ${Number.MAX_SAFE_INTEGER}`);
        }
    }

    let proposal = await promiseRetry(
        async (retryFunc, number) => {
            console.log(`Try #${number} to get Proposal ${proposalId}`);
            const proposals = await arc.proposals({ where: { id: proposalId } }, { fetchPolicy: 'no-cache' }).first()

            let isBehindLatestBlock = true; // set initally to true and change only if the blockNumber is provided and checked
            if (currBlockNumber) {
                const latestBlockNumber = await Utils.getGraphLatestBlockNumber();
                isBehindLatestBlock = currBlockNumber <= latestBlockNumber;
            }

            if (proposals.length === 0) {
                await retryFunc(`We could not find a proposal with id "${proposalId}" in the graph.`);
            } else if (!isBehindLatestBlock) {
                await retryFunc(`We could not find an update for block "${blockNumber}" in the graph.`);
            }

            return proposals[0]
        },
        { ...retryOptions, ...customRetryOptions }
    );

    const updatedDoc = await _updateProposalDb(proposal);

    console.log("updated proposal", proposal.id);
    return updatedDoc;
}

async function updateProposals() {
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
            if (e.code === 1 || e instanceof UnsupportedVersionError) {
                console.log(`Skipped ${proposal.id} due to old data version.`);

                skippedProposals.push({
                    proposalId: proposal.id,
                    skippedDueTo: e.message
                });
            } else {
                throw e;
            }
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
