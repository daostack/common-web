import { IVoteEntity } from '../../voteTypes';
import { proposalDb, voteDb } from '../../database';
import { hasAbsoluteMajority } from '../hasAbsoluteMajority';
import { finalizeProposal } from '../finalizeProposal';
import { commonDb } from '../../../common/database';
import { countVotes } from '../countVotes';
import { isInQuietEnding } from '../isInQuietEnding';
import { updateProposal } from '../../database/updateProposal';

export const processVote = async (vote: IVoteEntity): Promise<void> => {
  const proposal = await proposalDb.getProposal(vote.proposalId);
  const common = await commonDb.getCommon(vote.commonId);

  const votesBefore = countVotes(proposal);

  // Update the votes in the proposal document
  proposal.votes.push({
    voteId: vote.id,
    voterId: vote.voterId,
    voteOutcome: vote.outcome
  });

  // Check for majority and update the proposal state
  if (await hasAbsoluteMajority(proposal, common)) {
    console.info(`After vote (${vote.id}) proposal (${proposal.id}) has majority. Finalizing.`);

    await finalizeProposal(proposal);
  }

  // Verify the votes integrity
  const votes = await voteDb.getAllProposalVotes(proposal.id);

  if (votes.length !== proposal.votes.length) {
    proposal.votes = [];

    votes.forEach((voteData) => {
      proposal.votes.push({
        voteId: voteData.id,
        voterId: voteData.voterId,
        voteOutcome: voteData.outcome
      });
    });
  }

  // After the integrity is verified update the votesFor and votesAgainst
  const currentVoteCount = countVotes(proposal);

  proposal.votesFor = currentVoteCount.votesFor;
  proposal.votesAgainst = currentVoteCount.votesAgainst;

  // Check for vote flip
  if (votesBefore.outcome !== currentVoteCount.outcome) {
    console.info(`A vote flip occurred after vote ${vote.id}`);

    // If the proposal is in the quiet ending stage and
    // there was a vote flip extend the countdown
    if (isInQuietEnding(proposal)) {
      console.info(`
        Extending the countdown period of proposal (${proposal.id}) 
        because there was a vote flip during the quiet ending period.
      `);

      proposal.countdownPeriod += proposal.quietEndingPeriod;
    }
  }

  // Save all changes to the database
  await updateProposal(proposal);
};