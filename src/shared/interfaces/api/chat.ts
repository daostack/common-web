import { InfoItem } from "./discussionMessages";

export interface SendChatMessageDto {
  chatChannelId: string;
  text: string;
  images?: InfoItem[];
  files?: InfoItem[];
  mentions?: string[];
}
