import { IProposalEntity, IVoteEntity } from '@common/types';

import { commonDb } from '../../../common/database';
import { db } from '../../../util';
import { proposalDb } from '../../database';
import { countVotes } from '../countVotes';
import { finalizeProposal } from '../finalizeProposal';
import { hasAbsoluteMajority } from '../hasAbsoluteMajority';
import { isInQuietEnding } from '../isInQuietEnding';

export const processVote = async (vote: IVoteEntity): Promise<void> => {
  try {
    const updatedProposal = await db.runTransaction(async (transaction) => {
      let proposal = await proposalDb.transactional.get(transaction, vote.proposalId);

      const votesBefore = countVotes(proposal);

      // Update the votes in the proposal document
      proposal.votes.push({
        voteId: vote.id,
        voterId: vote.voterId,
        voteOutcome: vote.outcome
      });

      // After the integrity is verified update the votesFor and votesAgainst
      const currentVoteCount = countVotes(proposal);

      proposal.votesFor = currentVoteCount.votesFor;
      proposal.votesAgainst = currentVoteCount.votesAgainst;

      // Check for vote flip (but not on the first vote)
      if (votesBefore.outcome !== currentVoteCount.outcome && proposal.votes.length > 1) {
        logger.info(`A vote flip occurred after vote ${vote.id}`);

        // If the proposal is in the quiet ending stage and
        // there was a vote flip extend the countdown
        if (isInQuietEnding(proposal)) {
          logger.info(`
            Extending the countdown period of proposal (${proposal.id}) 
            because there was a vote flip during the quiet ending period.
          `);

          proposal.countdownPeriod += proposal.quietEndingPeriod;
        }
      }

      // Save all changes to the database
      proposal = (await proposalDb.transactional.update(transaction, proposal)) as IProposalEntity;

      // Return the snapshot of the common and the proposal
      return proposal;
    });

    const common = await commonDb.get(vote.commonId);

    // After the vote is done processing check if there is absolute majority and if there is
    // finalize the proposal
    if (await hasAbsoluteMajority(updatedProposal, common)) {
      logger.info(`After vote (${vote.id}) proposal (${updatedProposal.id}) has majority. Finalizing.`);

      await finalizeProposal(updatedProposal);
    }
  } catch (e) {
    logger.error('An error occurred while doing the process vote transaction', {
      error: e
    });
  }
};