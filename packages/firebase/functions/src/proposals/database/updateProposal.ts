import { IProposalEntity } from '@common/types';
import admin, { firestore } from 'firebase-admin';

import { ProposalsCollection } from './index';
import Transaction = admin.firestore.Transaction;

type WithRequired<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

type IdentifiablePartialProposal = WithRequired<Partial<IProposalEntity>, 'id'>;

/**
 * Updates the proposal in the backing store
 *
 * @param proposal - The updated proposal
 */
export const updateProposal = async (proposal: WithRequired<IProposalEntity, 'id'> | IProposalEntity): Promise<WithRequired<IProposalEntity, 'id'>> => {
  const proposalDoc = {
    ...proposal,

    updatedAt: firestore.Timestamp.now()
  };

  await ProposalsCollection
    .doc(proposalDoc.id)
    .update(proposalDoc);

  return proposalDoc;
};

/**
 * Updates the proposal in the scope of transaction
 *
 * @param transaction - The transactional scope
 * @param proposal - The updated proposal properties (must have the ID)
 */
export const updateProposalTransactional = async (transaction: Transaction, proposal: IdentifiablePartialProposal): Promise<IdentifiablePartialProposal> => {
  const updatedProposal = {
    ...proposal,
    updatedAt: firestore.Timestamp.now()
  };

  await transaction.update(ProposalsCollection.doc(proposal.id), proposal);

  return updatedProposal;
};