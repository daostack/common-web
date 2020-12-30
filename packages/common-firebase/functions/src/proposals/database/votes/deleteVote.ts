import admin from 'firebase-admin';

import WriteResult = admin.firestore.WriteResult;

import { ArgumentError } from '../../../util/errors';

import { VotesCollection } from '../index';


/**
 * Deletes vote. Use carefully. If you want to cleanly delete the
 * vote use `deleteVote` from the vote business folder. Please note that this
 * does not remove the vote outcome from the proposal itself.
 *
 * @param voteId - The id of the vote we want to delete
 *
 * @throws { ArgumentError } - If the vote ID is not provided
 */
export const deleteVoteFromDatabase = async (voteId: string): Promise<WriteResult> => {
  if (!voteId) {
    throw new ArgumentError('voteId');
  }

  logger.notice(`Deleting vote with ID ${voteId}`);

  return (await VotesCollection
    .doc(voteId)
    .delete());
};