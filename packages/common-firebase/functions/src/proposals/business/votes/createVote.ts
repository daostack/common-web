import * as yup from 'yup';

import { IVoteEntity, VoteOutcome } from '../../voteTypes';
import { commonDb } from '../../../common/database';
import { isCommonMember } from '../../../common/business';
import { proposalDb, voteDb } from '../../database';
import { ProposalFinalStates, StatusCodes } from '../../../constants';
import { validate } from '../../../util/validate';
import { CommonError } from '../../../util/errors';
import { hasVoted } from './hasVoted';
import { isExpired } from '../isExpired';
import { createEvent } from '../../../util/db/eventDbService';
import { EVENT_TYPES } from '../../../event/event';
import { processVote } from './processVotes';
import { finalizeProposal } from '../finalizeProposal';

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
 * @throws { CommonError } - If the proposal is expired
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
  if (await isExpired(proposal)) {
    // If the proposal is not in final state finalize it
    if(!ProposalFinalStates.includes(proposal.state)) {
      await finalizeProposal(proposal);
    }

    throw new CommonError('Vote was tried to be cast on expired proposal', {
      userMessage: 'Cannot vote on expired proposals!',
      statusCode: StatusCodes.UnprocessableEntity,

      proposal
    });
  }

  // Save the vote in the votes collection
  const vote = await voteDb.addVote({
    commonId: common.id,
    proposalId: proposal.id,
    voterId: payload.voterId,
    outcome: payload.outcome as VoteOutcome
  });

  // Process the vote
  await processVote(vote);

  // Emit the vote created event
  await createEvent({
    type: EVENT_TYPES.VOTE_CREATED,
    objectId: vote.id,
    userId: vote.voterId
  });

  // Return the created vote document
  return vote;
};