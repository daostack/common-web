import { DiscussionMessage } from "@/shared/models";

export interface ChatState {
  currentDiscussionMessageReply: DiscussionMessage | null;
}
