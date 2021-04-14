import { ProposalState, ProposalType } from '@prisma/client';

import { prisma } from '@toolkits';

import { finalizeJoinProposalCommand } from '../../commands/join/finalizeJoinProposalCommand';
import { finalizeFundingProposal } from '../../commands/funding/finalizeFundingProposal';


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

  // @todo Check if the condition for finalization are met (has majority, or is expired)

  if (proposal.type === ProposalType.JoinRequest) {
    await finalizeJoinProposalCommand(proposalId);
  } else if (proposal.type === ProposalType.FundingRequest) {
    await finalizeFundingProposal(proposalId);
  }
};