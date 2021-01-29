import { ArgumentError, NotFoundError } from '../../util/errors';
import { Nullable } from '../../util/types';

import { ProposalsCollection } from './index';
import { IProposalEntity } from '../proposalTypes';

import admin from 'firebase-admin';
import Transaction = admin.firestore.Transaction;

/**
 * Gets proposal by id
 *
 * @param proposalId - The ID of the proposal, that you want to find
 * @param throwErr - Whether error is thrown if the vote is not found
 *
 * @throws { ArgumentError } - If the proposalId param is with falsy value
 * @throws { NotFoundError } - If the proposal is not found
 *
 * @returns - The found proposal
 */
export const getProposal = async (proposalId: string, throwErr = true): Promise<IProposalEntity> => {
  if(!proposalId) {
    throw new ArgumentError('proposalId', proposalId);
  }

  const proposal = (await ProposalsCollection
    .doc(proposalId)
    .get()).data() as Nullable<IProposalEntity>;

  if (!proposal && throwErr) {
    throw new NotFoundError(proposalId, 'proposal');
  }

  return proposal;
}

/**
 * Get proposal by it with transactional safety
 *
 * @param transaction - The current transaction
 * @param proposalId - The ID of the proposal, that we want
 *
 * @returns - The found proposal
 */
export const getProposalTransactional = async (transaction: Transaction, proposalId: string): Promise<IProposalEntity> => {
  if (!proposalId) {
    throw new ArgumentError('proposalId', proposalId);
  }

  const proposalDoc = (await transaction.get(
    ProposalsCollection.doc(proposalId)
  )).data();

  if (!proposalDoc) {
    throw new NotFoundError(proposalId, 'proposal');
  }

  return proposalDoc;
};