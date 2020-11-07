import { v4 } from 'uuid';

import { BaseEntityType, DistributiveOmit } from '../../util/types';

import { IProposalEntity } from '../type';
import { proposalsCollection } from './index';


/**
 * Prepares the passed proposal for saving and saves it. Please note that
 * there is *no* validation being done here
 *
 * @param proposal - the proposal to be saves
 */
export const addProposal = async (proposal: DistributiveOmit<IProposalEntity, BaseEntityType>): Promise<IProposalEntity> => {
  const proposalDoc: IProposalEntity = {
    id: v4(),

    createdAt: new Date(),
    updatedAt: new Date(),

    ...(proposal as IProposalEntity)
  };

  await proposalsCollection
    .doc(proposalDoc.id)
    .set(proposalDoc);

  return proposalDoc;
};