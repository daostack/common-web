import { IProposalEntity } from '../proposalTypes';
import { ArgumentError, CommonError } from '../../util/errors';
import { calculateVotes } from './calculateVotes';
import { hasExpired } from './hasExpired';
import { updateProposal } from '../database/updateProposal';

/**
 * Finalizes (counts votes, changes status and more) the prassed proposal
 *
 * @param proposal - The proposal to finalize
 *
 * @throws { ArgumentError } - If the proposal is with falsy value
 */
export const finalizeProposal = async (proposal: IProposalEntity): Promise<IProposalEntity> => {
  if (!proposal) {
    throw new ArgumentError('proposal', proposal);
  }

  if (!await hasExpired(proposal)) {
    throw new CommonError('Trying to finalize non expired proposal', {
      proposal
    });
  }

  const votes = calculateVotes(proposal);

  // @todo What happens on tie
  proposal.state = votes.votesFor > votes.votesAgainst
    ? 'passed'
    : 'failed';

  await updateProposal(proposal);

  // @tbd This is for the events. How are we going to them?
  // if(proposal.state === 'passed') {
  //
  // }

  return proposal;
};