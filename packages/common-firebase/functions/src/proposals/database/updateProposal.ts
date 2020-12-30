import { firestore } from 'firebase-admin';

import { IProposalEntity } from '../proposalTypes';
import { ProposalsCollection } from './index';

type WithRequired<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

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
}