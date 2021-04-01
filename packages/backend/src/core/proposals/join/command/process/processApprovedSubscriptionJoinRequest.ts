import { createSubscriptionCommand } from '../../../../subscriptions/command/createSubscriptionCommand';


/**
 * Process proposal that is approved and made in subscription common
 *
 * @param proposalId - The ID of the approved proposal
 */
export const processApprovedSubscriptionJoinRequest = async (proposalId: string): Promise<void> => {
  await createSubscriptionCommand(proposalId);
};