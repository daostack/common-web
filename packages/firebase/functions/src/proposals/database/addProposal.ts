import admin from 'firebase-admin';
import Timestamp = admin.firestore.Timestamp;
import { v4 } from 'uuid';

import { IProposalEntity, SharedOmit } from '@common/types';

import { BaseEntityType } from '../../util/types';

import { ProposalsCollection } from './index';


type OmittedProperties = 'votes' | 'state' | 'paymentState' | 'votesFor' | 'votesAgainst';

/**
 * Prepares the passed proposal for saving and saves it. Please note that
 * there is *no* validation being done here
 *
 * @param proposal - the proposal to be saved
 */
export const addProposal = async (proposal: SharedOmit<IProposalEntity, BaseEntityType | OmittedProperties>): Promise<IProposalEntity> => {
  const proposalDoc: IProposalEntity = {
    id: v4(),

    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),

    votes: [],
    votesFor: 0,
    votesAgainst: 0,

    state: 'countdown',
    ...(proposal.type === 'fundingRequest' && {
      paymentState: 'notRelevant',
    }),

    ...(proposal as IProposalEntity)
  };

  if(process.env.NODE_ENV === 'test') {
    proposalDoc['testCreated'] = true;
  }

  await ProposalsCollection
    .doc(proposalDoc.id)
    .set(proposalDoc);

  return proposalDoc;
};