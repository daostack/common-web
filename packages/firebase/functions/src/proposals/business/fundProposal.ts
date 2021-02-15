import { CommonError } from '../../util/errors';

import { proposalDb } from '../database';
import { commonDb } from '../../common/database';
import { updateCommonBalance } from '../../common/business/updateCommonBalance';

/**
 * Changes the status of the proposal and updates the common. If the common currently has
 * less money than needed nothing will be done!
 *
 * @throws { CommonError } - If the proposal is not of funding type
 * @throws { CommonError } - If the proposal is not yet finalized
 *
 * @param proposalId - The ID of the proposal
 */
export const fundProposal = async (proposalId: string): Promise<void> => {
  const proposal = await proposalDb.getProposal(proposalId);
  const common = await commonDb.get(proposal.commonId);

  if (proposal.type !== 'fundingRequest') {
    throw new CommonError('Only funding proposal can be funded');
  }

  if (proposal.state !== 'passed') {
    throw new CommonError('Only passed proposal can be funded');
  }

  if (proposal.fundingRequest.funded) {
    throw new CommonError('The proposal is already funded');
  }

  if (common.balance < proposal.fundingRequest.amount) {
    throw new CommonError(
      `Proposal with id ${proposal.id} cannot be funded, because the common does not have enough balance!`
    );
  }

  proposal.fundingState = 'available';

  // Persist the changes asynchronously
  await Promise.all([
    // Change the commons balance and update the funding proposal
    updateCommonBalance(proposal.commonId, proposal.fundingRequest.amount * -1),
    proposalDb.update(proposal)
  ]);
};