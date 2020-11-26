import { ArgumentError, CommonError } from '../../util/errors';
import { NotFoundError } from '../../util/errors';
import { Nullable } from '../../util/types';

import { proposalsCollection } from './index';
import { IJoinRequestProposal, IProposalEntity } from '../proposalTypes';

/**
 * Gets join request by id
 *
 * @param proposalId - The ID of the proposal, that you want to find
 *
 * @throws { ArgumentError } - If the proposalId param is with falsy value
 * @throws { NotFoundError } - If the proposal is not found
 * @throws { CommonError } - If the proposal is found, but is not join request
 *
 * @returns - The found proposal
 */
export const getJoinRequest = async (proposalId: string): Promise<IJoinRequestProposal> => {
  if (!proposalId) {
    throw new ArgumentError('proposalId', proposalId);
  }

  const proposal = (await proposalsCollection
    .doc(proposalId)
    .get()).data() as Nullable<IProposalEntity>;

  if (!proposal) {
    throw new NotFoundError(proposalId, 'proposal');
  }

  if (proposal.type !== 'join') {
    throw new CommonError('Proposal found, but is not join request', {
      proposal
    });
  }

  return proposal;
};