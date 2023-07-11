import { DiscussionMessage } from "@/shared/models";

export type FileInfo = { info: File; src: string; size: number; name: string };

export interface ChatState {
  currentDiscussionMessageReply: DiscussionMessage | null;
  filesPreview: FileInfo[] | null;
}
