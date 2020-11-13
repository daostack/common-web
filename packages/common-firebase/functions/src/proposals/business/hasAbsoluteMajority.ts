import { ArgumentError } from '../../util/errors';

import { ICommonEntity } from '../../common/types';
import { commonDb } from '../../common/database';

import { IProposalEntity } from '../proposalTypes';
import { countVotes } from './countVotes';

/**
 * Checks if proposal has majority for any of the vote options
 *
 * @param proposal - The proposal that we want to check for majority
 * @param common - The common, in witch the proposal is created *Optional*
 *
 * @throws { ArgumentError } - If the passed proposal is with falsy value
 *
 * @returns - Boolean specifying if the proposal has majority in either of the votes
 */
export const hasAbsoluteMajority = async (proposal: IProposalEntity, common?: ICommonEntity): Promise<boolean> => {
  if(!proposal) {
    throw new ArgumentError('proposal', proposal);
  }

  if(!common) {
    common = await commonDb.getCommon(proposal.commonId);
  }

  const votes = countVotes(proposal);
  const votesNeededForMajority = Math.floor(common.members.length / 2) + 1;

  return votes.votesAgainst >= votesNeededForMajority
    || votes.votesFor >= votesNeededForMajority;
}