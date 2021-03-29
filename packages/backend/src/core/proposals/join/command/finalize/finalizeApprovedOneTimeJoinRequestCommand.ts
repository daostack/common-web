/**
 * Finalizes payments made in one time payment commons
 *
 * @param proposalId - The ID of the proposal root, not the join id
 */
import { ProposalState } from '@prisma/client';
import { prisma } from '@toolkits';

export const finalizeApprovedOneTimeJoinRequestCommand = async (proposalId: string): Promise<void> => {
  // await prisma.proposal.update({
  //   where: {
  //     id: proposalId
  //   },
  //   data: {
  //     state: ProposalState.Accepted
  //   }
  // });
  //
  // // Create event @todo Add the proposal ID to the payload
  // await eventsService.create({
  //   type: EventType.JoinRequestAccepted,
  //   userId: proposal.userId,
  //   commonId: proposal.commonId
  // });

  // Change the proposal state
  const proposal = await prisma.proposal.update({
    where: {
      id: proposalId
    },
    data: {
      state: ProposalState.Accepted
    }
  });


  // @todo Successful join proposal finalization
  // Charge the card and start polling on it
  // Change the proposal payment status to pending
  // If the charge has been successful
  // Add the user as member to that common

  // If the proposal is for subscription commons
  // Create the subscriptions (all other handling is done there)

  // @todo Mark the proposal as processed

  // Find the proposal
  // Count the votes
  // If approved
  //  -> Create payment
};