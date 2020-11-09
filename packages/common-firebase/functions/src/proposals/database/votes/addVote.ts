import { v4 } from 'uuid';

import { IVoteEntity } from '../../voteTypes';
import { BaseEntityType } from '../../../util/types';

import { votesCollection } from './index';

/**
 * Creates a vote document and saves it in the database
 *
 * @param vote - the vote object, from witch the document will be constructed
 */
export const addVote = async (vote: Omit<IVoteEntity, BaseEntityType>): Promise<IVoteEntity> => {
  const voteDoc: IVoteEntity = {
    id: v4(),

    createdAt: new Date(),
    updatedAt: new Date(),

    ...vote
  };

  await votesCollection
    .doc(voteDoc.id)
    .set(voteDoc);

  return voteDoc;
};