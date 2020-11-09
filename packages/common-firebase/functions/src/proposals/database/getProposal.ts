import { ArgumentError } from '../../util/errors';
import { NotFoundError } from '../../util/errors';
import { Nullable } from '../../util/types';

import { proposalsCollection } from './index';
import { IProposalEntity } from '../proposalTypes';

/**
 * Gets proposal by id
 *
 * @param proposalId - The ID of the proposal, that you want to find
 *
 * @throws { ArgumentError } - If the proposalId param is with falsy value
 * @throws { NotFoundError } - If the proposal is not found
 *
 * @returns - The found proposal
 */
export const getProposal = async (proposalId: string): Promise<IProposalEntity> => {
  if(!proposalId) {
    throw new ArgumentError('proposalId', proposalId);
  }

  const proposal = (await proposalsCollection
    .doc(proposalId)
    .get()).data() as Nullable<IProposalEntity>;

  if(!proposal) {
    throw new NotFoundError(proposalId, 'proposal');
  }

  return proposal;
}