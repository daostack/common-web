import { v4 } from 'uuid';

import { BaseEntityType, SharedOmit } from '../../util/types';

import { IProposalEntity } from '../proposalTypes';
import { proposalsCollection } from './index';


/**
 * Prepares the passed proposal for saving and saves it. Please note that
 * there is *no* validation being done here
 *
 * @param proposal - the proposal to be saves
 */
export const addProposal = async (proposal: SharedOmit<IProposalEntity, BaseEntityType | 'votes' | 'state'>): Promise<IProposalEntity> => {
  const proposalDoc: IProposalEntity = {
    id: v4(),

    createdAt: new Date(),
    updatedAt: new Date(),

    votes: [],

    state: 'countdown',

    ...(proposal as IProposalEntity)
  };

  if(process.env.NODE_ENV === 'test') {
    proposalDoc['testCreated'] = true;
  }

  await proposalsCollection
    .doc(proposalDoc.id)
    .set(proposalDoc);

  return proposalDoc;
};