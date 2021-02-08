import { IVoteEntity } from '@common/types';

import { ArgumentError, NotFoundError } from '../../../util/errors';
import { Nullable } from '../../../util/types';

import { VotesCollection } from '../index';

/**
 * Gets vote by id
 *
 * @param voteId - The ID of the vote, that you want to find
 *
 * @throws { ArgumentError } - If the voteId param is with falsy value
 * @throws { NotFoundError } - If the vote is not found
 *
 * @returns - The found vote
 */
export const getVote = async (voteId: string): Promise<IVoteEntity> => {
  if (!voteId) {
    throw new ArgumentError('voteId', voteId);
  }

  const vote = (await VotesCollection
    .doc(voteId)
    .get()).data() as Nullable<IVoteEntity>;

  if (!vote) {
    throw new NotFoundError(voteId, 'vote');
  }

  return vote;
};