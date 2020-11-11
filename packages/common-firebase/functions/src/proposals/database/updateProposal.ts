import { IProposalEntity } from '../proposalTypes';
import { proposalsCollection } from './index';

/**
 * Updates the proposal in the backing store
 *
 * @param proposal - The updated proposal
 */
export const updateProposal = async (proposal: IProposalEntity): Promise<IProposalEntity> => {
  const proposalDoc = {
    ...proposal,

    updatedAt: new Date()
  };

  await proposalsCollection
    .doc(proposalDoc.id)
    .update(proposalDoc);

  return proposalDoc;
}