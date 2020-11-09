import { IProposalEntity } from '../proposalTypes';
import { proposalDb, proposalsCollection } from './index';

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