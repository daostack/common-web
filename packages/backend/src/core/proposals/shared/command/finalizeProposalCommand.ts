import { ProposalState, ProposalType } from '@prisma/client';
import { prisma } from '@toolkits';

import { finalizeJoinProposalCommand } from '../../join/command/finalize/finalizeJoinProposalCommand';
import { CommonError } from '@errors';


/**
 * Finalizes the proposal so no more votes would be able to
 * be casted on it and the proposal outcome will be decided
 *
 * @param proposalId - The ID of the proposal to be finalized
 */
export const finalizeProposalCommand = async (proposalId: string): Promise<void> => {
  // Find the proposal and mark it as finalizing
  const proposal = await prisma.proposal.update({
    where: {
      id: proposalId
    },
    data: {
      state: ProposalState.Finalizing
    },
    select: {
      type: true
    }
  });

  // If it is join move it to handle finalizable join proposal
  if (proposal.type === ProposalType.JoinRequest) {
    await finalizeJoinProposalCommand(proposalId);
  }

  // If it is funding move it to handle finalizable funding proposal
  else if (proposal.type === ProposalType.FundingRequest) {
    // @todo Handle finalize funding request
  }

  // If it is not supported type throw
  else {
    throw new CommonError('Cannot finalize proposal that is neither of funding nor join type', {
      proposal
    });
  }
};