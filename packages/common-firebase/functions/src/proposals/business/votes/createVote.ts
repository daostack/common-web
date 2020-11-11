import * as yup from 'yup';

import { IVoteEntity, VoteOutcome } from '../../voteTypes';
import { commonDb } from '../../../common/database';
import { isCommonMember } from '../../../common/business';
import { proposalDb, voteDb } from '../../database';
import { StatusCodes } from '../../../constants';
import { validate } from '../../../util/validate';
import { CommonError, NotImplementedError } from '../../../util/errors';
import { hasVoted } from './hasVoted';
import { updateProposal } from '../../database/updateProposal';
import { hasMajority } from '../hasMajority';
import { hasExpired } from '../hasExpired';
import { finalizeProposal } from '../finalizeProposal';
import { calculateVotes } from '../calculateVotes';
import { isInQuietEnding } from '../isInQuietEnding';

const createVoteValidationScheme = yup.object({
  voterId: yup.string()
    .required(),

  proposalId: yup.string()
    .required()
    .uuid(),

  outcome: yup.string()
    .required()
    .oneOf(['rejected', 'approved'])
});

type CreateVotePayload = yup.InferType<typeof createVoteValidationScheme>;

/**
 * Cast a vote for proposal. Please note that where is no authentication check
 * being done here, so please be sure that the id of the user you
 * pass is from *authenticated* user
 *
 * @param payload - The payload from witch the vote will be created
 *
 * @throws { CommonError } - If the user is not part of the common, for witch the proposal was created
 * @throws { CommonError } - If the user has already casted a vote for this proposal
 *
 * @returns - The created vote entity as is in the *Votes* collection
 */
export const createVote = async (payload: CreateVotePayload): Promise<IVoteEntity> => {
  // Validate the data
  await validate(payload, createVoteValidationScheme);

  // Get the required data
  const proposal = await proposalDb.getProposal(payload.proposalId);
  const common = await commonDb.getCommon(proposal.commonId);

  // Check if the user is in that common
  if (!isCommonMember(common, payload.voterId)) {
    throw new CommonError('Cannot vote for proposals in commons that you are not member of', {
      statusCode: StatusCodes.Forbidden,

      payload,
      common
    });
  }

  // Check if the user has voted
  if (await hasVoted(proposal, payload.voterId)) {
    throw new CommonError('Only one vote from one user is allowed on one proposal', {
      userMessage: 'You can only cast one vote per proposal',
      statusCode: StatusCodes.UnprocessableEntity,

      common,
      payload,
      proposal
    });
  }

  // Check if the proposal is expired
  if (await hasExpired(proposal)) {
    throw new CommonError('Vote was tried to be cast on expired proposal', {
      userMessage: 'Cannot vote on expired proposals!',
      statusCode: StatusCodes.UnprocessableEntity,

      proposal
    });
  }

  const votesBefore = calculateVotes(proposal);

  // Save the vote in the votes collection
  const vote = await voteDb.addVote({
    commonId: common.id,
    proposalId: proposal.id,
    voterId: payload.voterId,
    outcome: payload.outcome as VoteOutcome
  });

  // Update the votes in the proposal document
  proposal.votes.push({
    voteId: vote.id,
    voterId: vote.voterId,
    voteOutcome: vote.outcome
  });

  // Save the updated proposal to the database
  await updateProposal(proposal);

  // Check for majority and update the proposal state
  if (await hasMajority(proposal, common)) {
    console.info(`After vote (${vote.id}) proposal (${proposal.id}) has majority. Finalizing.`);

    await finalizeProposal(proposal);
  }

  const votesAfter = calculateVotes(proposal);

  if (votesBefore.outcome !== votesAfter.outcome) {
    console.info(`A vote flip occurred after vote ${vote.id}`);

    // If the proposal is in the quiet ending stage and
    // there was a vote flip extend the countdown
    if (isInQuietEnding(proposal)) {
      console.info(`
        Extending the countdown period of proposal (${proposal.id}) 
        because there was a vote flip during the quiet ending period.
      `);

      proposal.countdownPeriod += proposal.quietEndingPeriod;

      await updateProposal(proposal);
    }
  }

  // @tbd Create the event, that vote was created

  // Return the created vote document
  return vote;
};