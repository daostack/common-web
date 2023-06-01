import { ChatMessage } from "@/shared/models";
import { SynchronizedDate } from "../SynchronizedDate";
import { InfoItem } from "./discussionMessages";

export interface GetChatChannelMessagesResponse {
  chatMessages: ChatMessage[];
  firstDocTimestamp: SynchronizedDate | null;
  lastDocTimestamp: SynchronizedDate | null;
  count: number;
  hasMore: boolean;
}

export interface SendChatMessageDto {
  chatChannelId: string;
  text: string;
  images?: InfoItem[];
  files?: InfoItem[];
  mentions?: string[];
}
