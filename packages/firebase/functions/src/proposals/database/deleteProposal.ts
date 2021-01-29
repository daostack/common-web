import admin from 'firebase-admin';

import WriteResult = admin.firestore.WriteResult;

import { ArgumentError } from '../../util/errors';
import { ProposalsCollection } from './index';

/**
 * Deletes proposal. Use carefully. If you want to cleanly delete the
 * proposal use `deleteProposal` from the proposal business folder
 *
 * @param proposalId - The id of the proposal we want to delete
 *
 * @throws { ArgumentError } - If the proposal ID is not provided
 */
export const deleteProposalFromDatabase = async (proposalId: string): Promise<WriteResult> => {
  if (!proposalId) {
    throw new ArgumentError('proposalId');
  }

  logger.notice(`Deleting proposal with ID ${proposalId}`);

  return (await ProposalsCollection
    .doc(proposalId)
    .delete());
};