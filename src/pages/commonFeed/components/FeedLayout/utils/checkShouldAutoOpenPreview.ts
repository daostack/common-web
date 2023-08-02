import { ChatItem } from "@/pages/common/components/ChatComponent";
import { ProposalState } from "@/shared/models";

export const checkShouldAutoOpenPreview = (
  chatItem?: ChatItem | null,
): boolean =>
  !chatItem?.seenOnce || chatItem?.proposal?.state === ProposalState.VOTING;
