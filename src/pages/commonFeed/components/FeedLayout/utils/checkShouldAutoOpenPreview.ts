import { ChatItem } from "@/pages/common/components/ChatComponent";
import { ProposalState } from "@/shared/models";
import { checkIsCountdownState } from "@/shared/utils";

export const checkShouldAutoOpenPreview = (
  chatItem?: ChatItem | null,
): boolean => {
  if (!chatItem || !chatItem.discussion) {
    return false;
  }
  if (
    chatItem.proposal &&
    (!chatItem.seenOnce || chatItem.proposal.state === ProposalState.VOTING)
  ) {
    return true;
  }
  if (chatItem.discussion && !chatItem.seenOnce) {
    return false;
  }
  const expirationTimestamp =
    chatItem.proposal?.data.votingExpiresOn ||
    chatItem.proposal?.data.discussionExpiresOn;

  return Boolean(
    !chatItem.lastSeenAt ||
      (chatItem.proposal &&
        !checkIsCountdownState(chatItem.proposal) &&
        expirationTimestamp &&
        chatItem.lastSeenAt.seconds < expirationTimestamp.seconds),
  );
};
